import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReportEntiy } from "./entity/report.entity";
import { Repository, QueryFailedError } from 'typeorm';
import { AuthService } from "src/auth/auth.service";
import { MemberEntity } from "src/auth/member.entity";
import { CategoryService } from "../category/category.service";
import { CategoryEntity } from "../category/entity/category.entity";
import { Transactional } from "typeorm-transactional";
import { VocService } from "src/voc/service/voc.service";
import { VocAnalysisEntity } from "src/voc/entity/voc-analysis.entity";
import { CustomOpenAI } from "src/llm/llm-module";
import { CategoryAnalysisSourceDto } from "./dto/category-analysis-source.dto";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntiy)
    private readonly reportRepository: Repository<ReportEntiy>,
    private readonly authService: AuthService,
    private readonly vocService: VocService,
    private readonly categoryService: CategoryService,
    private readonly customOpenAI:CustomOpenAI,
  ){}

  @Transactional()
  async createReport(productId: string, memberId: string, pdf_path:string){
    const member:MemberEntity = await this.authService.findById(memberId)
    this.nullCheckForEntity(member);

    const categoryEntities:CategoryEntity[] = await this.categoryService.loadCategories(memberId);
    const categories:string[] = categoryEntities.map((result)=>{return result.categoryName});
    
    // ToDo: 카테고리 빈 리스트일 경우 예외처리

    // ToDo: VOC ANALYSIS 데이터 불러오기 & RAG 적용
    const vocAnalysis:VocAnalysisEntity[] = await this.vocService.getVocAnalysisByProductId(productId);
    const positiveKeywords:string[] = vocAnalysis.map((result)=>{
      if(result.sentiment.sentiment == 'positive'){
        return result.sentiment.category;
      };
    });

    const negativeKeywords: string[] = vocAnalysis.map((result)=>{
      if(result.sentiment.sentiment == 'negative'){
        return result.sentiment.category
      };
    });

    const ragResult = await this.customOpenAI.customRAG(categories, positiveKeywords, negativeKeywords, pdf_path);
    const categoryResults: CategoryAnalysisSourceDto[] = [];

    // ToDo: Category별로 ReportSource만들기:
    for(let i=0; i<ragResult.length; i++){
      const categoryName:string = ragResult[i].category;
      const keywordsSource = [];
      const positiveAnswer = ragResult[i].sentiment.긍정;
      const negativeAnswer = ragResult[i].sentiment.부정;
      const positiveCnt = vocAnalysis.filter(result => result.primarySentiment === 'positive').length;
      const negativeCnt = vocAnalysis.filter(result => result.primarySentiment === 'negative').length;
      const categoryResult = CategoryAnalysisSourceDto.create(categoryName, keywordsSource, positiveAnswer, negativeAnswer, positiveCnt, negativeCnt)
      categoryResults.push(categoryResult);
    };

    return  categoryResults
  };

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  };
}