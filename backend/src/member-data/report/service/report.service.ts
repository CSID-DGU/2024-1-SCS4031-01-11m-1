import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReportEntity } from "../entity/report.entity";
import { Repository, Between, In } from 'typeorm';
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
import { CountPerCategoryDto } from "./dto/count-per-category.dto";
import { VocEntity } from "src/voc/entity/voc.entity";
import { ReportDto } from "./dto/report.dto";

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
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(VocEntity)
    private readonly vocRepository: Repository<VocEntity>
  ){}

  @Transactional()
  async createReport(productId: string, memberId: string, minuteId:string, startDate: Date, endDate:Date):Promise<string>{
    try{
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

    const unupdatedKeywords: string[] = []
    for(const positiveKeywordByCtg of positiveKeywordsByCtg){
      unupdatedKeywords.push(...positiveKeywordByCtg.keywords)
    };
    for(const negativeKeywordByCtg of negativeKeywordsByCtg){
      unupdatedKeywords.push(...negativeKeywordByCtg.keywords)
    };
    const set = new Set(unupdatedKeywords);
    const keywords = [...set]

    // 레포트 생성
    const ragResults:customRAGresult[] = await this.customOpenAI.customRAG(categories, positiveKeywordsByCtg, negativeKeywordsByCtg, minute.path);

    const reportSources: ReportSource[] = [];
    for(const ragResult of ragResults){
      const categoryResult = await this.createReportSource(ragResult, keywords, vocAnalysisesGroupByCtg, vocAnalysises)
      reportSources.push(categoryResult);
    };

    const reportEntity = ReportEntity.createNew(reportSources, member, productName);
    await this.reportRepository.save(reportEntity);

    return reportEntity.id;
    }catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 레포트를 생성하는중 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
    
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

  async loadReport(reportId: string): Promise<ReportDto>{
    const report: ReportEntity = await this.reportRepository.findOneBy({id: reportId});
    this.nullCheckForEntity(report)
    const vocCountMap:Map<string,number[]> = new Map();
    const categoryMap:Map<string, CategoryEntity> = new Map();

    let createdAt:Date = report.createdAt;
    let day:number = createdAt.getDate()-1;
    let date:Date = new Date(createdAt);
    let thisMonthLastDate:Date;
    let previousMonthDate:Date;
    let dayBeforeDate:Date;
    
    const vocCountPerCategory: CountPerCategoryDto[] = [];
    this.nullCheckForEntity(report);

    const member:MemberEntity = report.member;
    const product:ProductEntity = await this.productRepository.findOne({
      where:{member:member, productName:report.productName}
    });
    const urlIdList:string[] = [];
    product.urls.forEach((url) => {urlIdList.push(url.id)});
    (await this.categoryRepository.findBy({member: member})).forEach((category) => {
      vocCountMap.set(category.categoryName, [0,0]);
      categoryMap.set(category.categoryName, category);
    });
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setDate(date.getDate()-day);

    thisMonthLastDate = new Date(date);
    thisMonthLastDate.setMonth(thisMonthLastDate.getMonth()+1);
    thisMonthLastDate.setDate(thisMonthLastDate.getDate()-1)
    thisMonthLastDate.setHours(11);
    thisMonthLastDate.setMinutes(59);
    thisMonthLastDate.setSeconds(59);

    previousMonthDate = new Date(date);
    previousMonthDate.setHours(0);
    previousMonthDate.setMinutes(0);
    previousMonthDate.setSeconds(0);
    previousMonthDate.setMonth(previousMonthDate.getMonth()-1)

    dayBeforeDate = new Date(date);
    dayBeforeDate.setDate(dayBeforeDate.getDate()-1);
    dayBeforeDate.setHours(11);
    dayBeforeDate.setMinutes(59);
    dayBeforeDate.setSeconds(59);

    console.log(date.toLocaleString())
    console.log(thisMonthLastDate.toLocaleString());
    console.log(previousMonthDate.toLocaleString());
    console.log(dayBeforeDate.toLocaleString());

    const vocs:VocEntity[] = await this.vocRepository.find({
      where: {
        uploadedDate: Between(
          date, thisMonthLastDate
        ), url: In(urlIdList)
      }
    });

    vocs.forEach((voc) => {
      if(voc.vocAnalysis != null){
      const categoryName:string = voc.vocAnalysis.category.categoryName
      vocCountMap.get(categoryName)[0] = vocCountMap.get(categoryName)[0]+1}
    });

    const previousVocs:VocEntity[] = await this.vocRepository.find({
      where: {
        uploadedDate: Between(
          previousMonthDate, dayBeforeDate
        ), url: In(urlIdList)
      }
    });

    previousVocs.forEach((voc) => {
      if(voc.vocAnalysis != null){
      const categoryName:string = voc.vocAnalysis.category.categoryName;
      vocCountMap.get(categoryName)[1] = vocCountMap.get(categoryName)[1] + 1;}
    });

    vocCountMap.forEach((vocCount, categoryName) => {
      vocCountPerCategory.push(new CountPerCategoryDto(categoryName, categoryMap.get(categoryName).id, vocCount[1], vocCount[0]));
    })

    return ReportDto.createFromEntity(report, vocCountPerCategory);
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
    // const vocAnalysisResults = vocAnalysisByCtg.vocAnalysises;
    // const vocEntities = [...new Set(vocAnalysisResults.map((result)=>{return result.voc}))];
    // const vocReviews = vocEntities.map((result)=>{return result.description})
    const vocReviews = await this.getVocDescription(vocAnalysisByCtg);
    const vocSummarizeResults = await this.customOpenAI.chunkSummarize(vocReviews, vocAnalysisByCtg.categoryName);
    return vocSummarizeResults;
  }

  private async getVocDescription(vocAnalysisByCtg:VocAnalysisesAndCategory):Promise<string[]>{
    const vocAnalysisResults = vocAnalysisByCtg.vocAnalysises;
    const vocEntities = [...new Set(vocAnalysisResults.map((result)=>{return result.voc}))];
    const vocReviews = vocEntities.map((result)=>{return result.description})
    return vocReviews;
  }

  private async createReportSource(ragResult: customRAGresult, keywords: string[], vocAnalysisesGroupByCtg:VocAnalysisesAndCategory[], vocAnalysises: VocAnalysisEntity[]){
    const categoryName:string = ragResult.categoryName;

      // const keywordsList = keywordEntities.filter(result => result.category.categoryName === categoryName);
      // const keywords:string[] = keywordsList[0]?.keywords;
      

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
      const vocReviews: string[] = await this.getVocDescription(vocAnalysisByCtg[0]); // ToDo: voc review data
      const vocSummaries: string[] = await this.summarizeVocReviews(vocAnalysisByCtg[0]);
      
      const positiveCnt = vocAnalysises.filter(result => result.primarySentiment === 'positive' && result.category.categoryName==categoryName).length;
      const negativeCnt = vocAnalysises.filter(result => result.primarySentiment === 'negative' && result.category.categoryName==categoryName).length;
      const categoryResult = ReportSource.create(categoryName, keywords, vocSummaries,vocReviews, answers, positiveCnt, negativeCnt)
      return categoryResult;
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  };

  private nullCheckForList(lst){
    if(lst.length == 0) throw new NotFoundException();
  };
}