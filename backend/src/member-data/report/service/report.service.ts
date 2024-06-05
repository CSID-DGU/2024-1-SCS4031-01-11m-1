import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReportEntiy } from "../entity/report.entity";
import { Repository, QueryFailedError } from 'typeorm';
import { AuthService } from "src/auth/auth.service";
import { MemberEntity } from "src/auth/member.entity";
import { CategoryService } from "../../category/category.service";
import { CategoryEntity } from "../../category/entity/category.entity";
import { Transactional } from "typeorm-transactional";
import { VocService } from "src/voc/service/voc.service";
import { VocAnalysisEntity } from "src/voc/entity/voc-analysis.entity";
import { CustomOpenAI } from "src/llm/llm-module";
import { ReportSource } from "../domain/report-source";
import { VocKeywordEntity } from "src/voc/entity/voc-keyword.entity";
import { ProductMinuteEntity } from "src/member-data/products/entities/product-minute.entity";
import { KeywordsBySentimentCtg, VocAnalysisesAndCategory, customRAGresult } from "src/utils/type-definiton/type-definition";
import { ProductEntity } from "src/member-data/products/entities/product.entity";
import { ReportListDto } from "./dto/report-list.dto";
import { ReportMapper } from "./mapper/report-mapper";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntiy)
    private readonly reportRepository: Repository<ReportEntiy>,
    private readonly authService: AuthService,
    private readonly vocService: VocService,
    private readonly categoryService: CategoryService,
    private readonly customOpenAI:CustomOpenAI,
    @InjectRepository(ProductMinuteEntity)
    private readonly productMinuteRepository: Repository<ProductMinuteEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ){}

  @Transactional()
  async createReport(productId: string, memberId: string, minuteId:string){
    const member:MemberEntity = await this.authService.findById(memberId);
    this.nullCheckForEntity(member);

    const product: ProductEntity = await this.productRepository.findOneBy({id:productId});
    const productName:string = product.productName;

    const minute:ProductMinuteEntity = await this.productMinuteRepository.findOneBy({id: minuteId});
    this.nullCheckForEntity(minute);

    const categoryEntities:CategoryEntity[] = await this.categoryService.loadCategories(memberId);
    // ToDo: 카테고리 빈 리스트일 경우 예외처리
    const categories:string[] = categoryEntities.map((result)=>{return result.categoryName});
    const keywordEntities:VocKeywordEntity[] = await this.vocService.getVocKeywordsByProductId(productId);

    // ToDo: VOC ANALYSIS 데이터 불러오기 & RAG 적용
    const vocAnalysis:VocAnalysisEntity[] = await this.vocService.getVocAnalysisByProductId(productId);
    
    const vocAnalysisesGroupByCtg: VocAnalysisesAndCategory[] = [];
    for (const category of categoryEntities){
      const vocAnalysisByCtg = vocAnalysis.filter((result)=>{result.category == category})
      const vocAnalysisAndCategory: VocAnalysisesAndCategory = {categoryName: category.categoryName, vocAnalysises: vocAnalysisByCtg};
      vocAnalysisesGroupByCtg.push(vocAnalysisAndCategory);
    };

    const positiveKeywordsByCtg: KeywordsBySentimentCtg[] = []
    const negativeKeywordsByCtg: KeywordsBySentimentCtg[] = []
  
    for(const vocAnalysisByCtg of vocAnalysisesGroupByCtg){
      const positiveKeywordByCtg: KeywordsBySentimentCtg = await this.createKeywordsByCtg(vocAnalysisByCtg, 'positive')
      positiveKeywordsByCtg.push(positiveKeywordByCtg);
      const negativeKeywordByCtg: KeywordsBySentimentCtg = await this.createKeywordsByCtg(vocAnalysisByCtg, 'negative')
      negativeKeywordsByCtg.push(negativeKeywordByCtg);
    };

    const ragResult:customRAGresult[] = await this.customOpenAI.customRAG(categories, positiveKeywordsByCtg, negativeKeywordsByCtg, minute.path);
    const reportSources: ReportSource[] = [];

    for(let i=0; i<ragResult.length; i++){
      const categoryName:string = ragResult[i].category;

      const keywordsList = keywordEntities.filter(result => result.category.categoryName === categoryName);
      const keywords:string[] = keywordsList[0].keywords; // ToDo: refactoring

      const positiveAnswers = ragResult[i].sentiment.긍정;
      const negativeAnswers = ragResult[i].sentiment.부정;

      const answers: string[] = [];
      for(const positiveAnswer of positiveAnswers){
        const answer: string = positiveAnswer.answer
        answers.push(answer);
      };
      for(const negativeAnswer of negativeAnswers){
        const answer: string = negativeAnswer.answer
        answers.push(answer);
      };

      let vocSummaries: string[];
      for(const vocAnalysisByCtg of vocAnalysisesGroupByCtg){
        if(vocAnalysisByCtg.categoryName === categoryName){
          vocSummaries = await this.summarizeVocReviews(vocAnalysisByCtg);
        }
      }
      
      const positiveCnt = vocAnalysis.filter(result => result.primarySentiment === 'positive').length;
      const negativeCnt = vocAnalysis.filter(result => result.primarySentiment === 'negative').length;
      const categoryResult = ReportSource.create(categoryName, keywords, vocSummaries, answers, positiveCnt, negativeCnt)
      reportSources.push(categoryResult);
    };

    const reportEntity = ReportEntiy.createNew(reportSources, member, productName);
    await this.reportRepository.save(reportEntity);
  };

  async loadReports(memberId: string):Promise<ReportListDto[]>{
    const member:MemberEntity = await this.authService.findById(memberId)
    this.nullCheckForEntity(member);

    const reports = await this.reportRepository.findBy({member});
    const reportListDtos:ReportListDto[] = []
    for(const report of reports){
      const reportListDto = ReportMapper.reportEntityToReportListDto(report)
      reportListDtos.push(reportListDto);
    }
    return reportListDtos
  };

  async loadReport(reportId: string): Promise<ReportEntiy>{
    const report: ReportEntiy = await this.reportRepository.findOneBy({id: reportId});
    this.nullCheckForEntity(report);
    return report;
  };

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  };

  private async createKeywordsByCtg(vocAnalysisByCtg:VocAnalysisesAndCategory, sentiment: string):Promise<KeywordsBySentimentCtg>{
    const vocAnalysisResults = vocAnalysisByCtg.vocAnalysises.filter((result)=>{result.primarySentiment == `${sentiment}`})
    const vocEntities = [...new Set(vocAnalysisResults.map((result)=>{return result.voc}))];
    const vocReviews = vocEntities.map((result)=>{return result.description});
    const keywords = await this.customOpenAI.keywordExtraction(vocReviews,vocAnalysisByCtg.categoryName);
    const keywordsByCtg: KeywordsBySentimentCtg = {categotyName:vocAnalysisByCtg.categoryName, keywords:keywords}
    return keywordsByCtg;
  };

  private async summarizeVocReviews(vocAnalysisByCtg:VocAnalysisesAndCategory):Promise<string[]>{
    const vocAnalysisResults = vocAnalysisByCtg.vocAnalysises;
    const vocEntities = [...new Set(vocAnalysisResults.map((result)=>{return result.voc}))];
    const vocReviews = vocEntities.map((result)=>{return result.description})
    const vocSummarizeResults = await this.customOpenAI.chunkSummarize(vocReviews, vocAnalysisByCtg.categoryName);
    return vocSummarizeResults;
  }
}