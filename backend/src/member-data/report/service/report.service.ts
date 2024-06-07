import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReportEntity } from "../entity/report.entity";
import { Repository} from 'typeorm';
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
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
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
  async createReport(productId: string, memberId: string, minuteId:string, startDate: Date, endDate:Date):Promise<string>{
    // DB에서 데이터 수집
    const member:MemberEntity = await this.authService.findById(memberId);
    this.nullCheckForEntity(member);

    const product: ProductEntity = await this.productRepository.findOneBy({id:productId});
    this.nullCheckForEntity(product);
    const productName:string = product.productName;

    const minute:ProductMinuteEntity = await this.productMinuteRepository.findOneBy({id: minuteId});
    this.nullCheckForEntity(minute);

    const categoryEntities:CategoryEntity[] = await this.categoryService.loadCategories(memberId);
    this.nullCheckForList(categoryEntities);
    const categories:string[] = categoryEntities.map((result)=>{return result.categoryName});

    const keywordEntities:VocKeywordEntity[] = await this.vocService.getVocKeywordsByProductId(productId);
    this.nullCheckForList(keywordEntities);

    const vocAnalysises:VocAnalysisEntity[] = await this.vocService.getVocAnalysisByProductIdAndDate(productId, startDate, endDate);
    this.nullCheckForList(vocAnalysises);

    // 데이터 가공
    const vocAnalysisesGroupByCtg: VocAnalysisesAndCategory[] = []; // 카테고리별 voc 분석결과
    for (const category of categoryEntities){
      const vocAnalysisByCtg:VocAnalysisEntity[] = vocAnalysises.filter(result => result.category.categoryName == category.categoryName)
      const vocAnalysisAndCategory: VocAnalysisesAndCategory = {categoryName: category.categoryName, vocAnalysises: vocAnalysisByCtg};
      vocAnalysisesGroupByCtg.push(vocAnalysisAndCategory);
    };

    const positiveKeywordsByCtg: KeywordsBySentimentCtg[] = [] // 카테고리별 "긍정 키워드" 리스트
    const negativeKeywordsByCtg: KeywordsBySentimentCtg[] = [] // 카테고리별 "부정 키워드" 리스트
    for(const vocAnalysisByCtg of vocAnalysisesGroupByCtg){
      const positiveKeywordByCtg: KeywordsBySentimentCtg = await this.createKeywordsByCtg(vocAnalysisByCtg, 'positive')
      positiveKeywordsByCtg.push(positiveKeywordByCtg);
      const negativeKeywordByCtg: KeywordsBySentimentCtg = await this.createKeywordsByCtg(vocAnalysisByCtg, 'negative')
      negativeKeywordsByCtg.push(negativeKeywordByCtg);
    };

    // 레포트 생성
    const ragResults:customRAGresult[] = await this.customOpenAI.customRAG(categories, positiveKeywordsByCtg, negativeKeywordsByCtg, minute.path);

    const reportSources: ReportSource[] = [];
    for(const ragResult of ragResults){
      const categoryResult = await this.createReportSource(ragResult, keywordEntities, vocAnalysisesGroupByCtg, vocAnalysises)
      reportSources.push(categoryResult);
    };

    const reportEntity = ReportEntity.createNew(reportSources, member, productName);
    await this.reportRepository.save(reportEntity);

    return reportEntity.id;
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

  async loadReport(reportId: string): Promise<ReportEntity>{
    const report: ReportEntity = await this.reportRepository.findOneBy({id: reportId});
    this.nullCheckForEntity(report);
    return report;
  };

  @Transactional()
  async deleteReport(reportId: string): Promise<void>{
    const report: ReportEntity = await this.reportRepository.findOneBy({id: reportId});
    this.nullCheckForEntity(report);
    await this.reportRepository.remove(report);
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

  private async createReportSource(ragResult: customRAGresult, keywordEntities: VocKeywordEntity[], vocAnalysisesGroupByCtg:VocAnalysisesAndCategory[], vocAnalysises: VocAnalysisEntity[]){
    const categoryName:string = ragResult.categoryName;

      const keywordsList = keywordEntities.filter(result => result.category.categoryName === categoryName);
      const keywords:string[] = keywordsList[0]?.keywords;

      const positiveAnswers = ragResult.sentiment.긍정;
      const negativeAnswers = ragResult.sentiment.부정;

      const answers: string[] = [];
      for(const positiveAnswer of positiveAnswers){
        const answer: string = positiveAnswer.answer
        answers.push(answer);
      };
      for(const negativeAnswer of negativeAnswers){
        const answer: string = negativeAnswer.answer
        answers.push(answer);
      };

      const vocAnalysisByCtg: VocAnalysisesAndCategory[] = vocAnalysisesGroupByCtg.filter( result => result.categoryName==categoryName );
      const vocSummaries: string[] = await this.summarizeVocReviews(vocAnalysisByCtg[0]);
      
      const positiveCnt = vocAnalysises.filter(result => result.primarySentiment === 'positive' && result.category.categoryName==categoryName).length;
      const negativeCnt = vocAnalysises.filter(result => result.primarySentiment === 'negative' && result.category.categoryName==categoryName).length;
      const categoryResult = ReportSource.create(categoryName, keywords, vocSummaries, answers, positiveCnt, negativeCnt)
      return categoryResult;
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  };

  private nullCheckForList(lst){
    if(lst.length == 0) throw new NotFoundException();
  };
}