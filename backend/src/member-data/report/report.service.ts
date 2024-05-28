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
import { ReportSource } from "./domain/report-source";
import { VocKeywordEntity } from "src/voc/entity/voc-keyword.entity";

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
    // ToDo: 카테고리 빈 리스트일 경우 예외처리
    const categories:string[] = categoryEntities.map((result)=>{return result.categoryName});
    const keywordEntities:VocKeywordEntity[] = await this.vocService.getVocKeywordsByProductId(productId);

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
    const reportSources: ReportSource[] = [];

    // ToDo: Category별로 ReportSource만들기:
    for(let i=0; i<ragResult.length; i++){
      const categoryName:string = ragResult[i].category;

      const keywordsList = keywordEntities.filter(result => result.category.categoryName === categoryName);
      const keywords:string[] = keywordsList[0].keywords; // ToDo: refactoring
      
      const positiveAnswer = ragResult[i].sentiment.긍정;
      const negativeAnswer = ragResult[i].sentiment.부정;
      const positiveCnt = vocAnalysis.filter(result => result.primarySentiment === 'positive').length;
      const negativeCnt = vocAnalysis.filter(result => result.primarySentiment === 'negative').length;
      const categoryResult = ReportSource.create(categoryName, keywords, positiveAnswer, negativeAnswer, positiveCnt, negativeCnt)
      reportSources.push(categoryResult);
    };
    
    const reportEntity = ReportEntiy.createNew(reportSources, member);
    await this.reportRepository.save(reportEntity);
  };

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  };
}