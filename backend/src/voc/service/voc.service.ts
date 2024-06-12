import { Injectable } from "@nestjs/common";
import { DataScrapingModuleMapping } from "../data-scraper/data-scraper-mapping";
import { InjectRepository } from "@nestjs/typeorm";
import { VocEntity } from "../entity/voc.entity";
import { Repository, QueryFailedError, Between } from 'typeorm';
import { UrlEntity } from "src/member-data/products/entities/url.entity";
import { ProductEntity } from "src/member-data/products/entities/product.entity";
import { UrlVocListDto } from "src/voc/controller/controller-dto/get-voc-by-productId/url-voc-list.dto"
import { VocDto } from "../dto/voc.dto";
import { DataScraperReturnDto } from "../data-scraper/data-scraper-return.dto";
import { CategoryEntity } from "src/member-data/category/entity/category.entity";
import { VocAnalysisEntity } from "../entity/voc-analysis.entity";
import { MemberEntity } from "src/auth/member.entity";
import { CustomOpenAI } from "src/llm/llm-module";
import { SentimentEnum } from "../entity/sentiment.enum";
import { VocKeywordEntity } from "../entity/voc-keyword.entity";
import { VocByDateDto } from "../dto/voc-by-date.dto";
import { Transactional } from "typeorm-transactional";
import { VocCountPerCategoryDto } from "../dto/voc-count-per-category";
import { VocCountPerWeekDto } from "../dto/voc-count-per-week.dto";

@Injectable()
export class VocService{
    constructor(
        private dataScrapingModuleMapping: DataScrapingModuleMapping,
        
        @InjectRepository(VocEntity)
        private readonly vocRepository: Repository<VocEntity>,

        @InjectRepository(UrlEntity)
        private readonly urlRepository: Repository<UrlEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,

        @InjectRepository(VocAnalysisEntity)
        private readonly vocAnalysisRepository: Repository<VocAnalysisEntity>,

        @InjectRepository(VocKeywordEntity)
        private readonly vocKeywordRepository: Repository<VocKeywordEntity>,

        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,

        private readonly customOpenAI:CustomOpenAI
    ){}

    //---------------------------VOC 데이터 불러오기-----------------------------------//
    public async getVocCountPerCategory(product_id:string):Promise<VocCountPerCategoryDto[]>{
        const product:ProductEntity = await this.productRepository.findOneBy({id:product_id});
        const urls:UrlEntity[] = product.urls;

        const result:VocEntity[] = await this.vocRepository.find({
            where: {url:urls[0]},
            order: {uploadedDate:"DESC"} 
        });

        const vocList = await this.sortVocByDate(result);

        console.log(vocList);

        return await this.countVocByCategory(vocList);
    }

    public async getVocCountByMemberId(member_id:string):Promise<VocCountPerCategoryDto[]>{
        const member:MemberEntity = await this.memberRepository.findOneBy({memberId:member_id});
        const productList:ProductEntity[] = await this.productRepository.findBy({member:member});
        const vocList:VocEntity[] = [];

        for(let i = 0; i<productList.length; i++){
            const vocEntityList:VocEntity[] = await this.getVocByProduct(productList[i]);
            vocEntityList.forEach((vocEntity) => {
                vocList.push(vocEntity);
            });
        }

        const sortedVocList = await this.sortVocByWeek(vocList);
        return await this.countVocByCategory(sortedVocList);
    }

    /**
     * Voc데이터 수집
     */
    public async scrapeDataByUrlId(url_id:string): Promise<String>{
        const urlEntity: UrlEntity = await this.urlRepository.findOneBy({id: url_id});

        await this.scrapeData(urlEntity);

        return "Success";
    }

    @Transactional()
    public async scrapeDataByProductId(product_id:string): Promise<String>{
        console.time("measure");

        const product:ProductEntity = await this.productRepository.findOneBy({id: product_id});
        const newVocEntityList:VocEntity[] = [];
        const member:MemberEntity = await product.member;

        for(let i:number = 0; i<product.urls.length; i++){
            const url:UrlEntity = product.urls[i];
            const result:DataScraperReturnDto[] = await this.scrapeData(url);

            for(let i = 0; i<result.length; i++){
                const vocEntity:VocEntity = VocEntity.create(result[i].getDescription(), result[i].getScore(), url, result[i].getDate());
                await this.vocRepository.save(vocEntity);
                newVocEntityList.push(vocEntity);
            }
        }

        const vocTextList:string[] = await this.analyzeData(newVocEntityList, member);

        await this.extractKeywords(vocTextList, member, product);

        console.timeEnd('measure');

        return "Success";
    }

    @Transactional()
    public async scrapeDataByProductEntity(product:ProductEntity): Promise<String>{
        const newVocEntityList:VocEntity[] = [];
        const member:MemberEntity = await product.member;

        console.log(product.urls);

        for(let i:number = 0; i<product.urls.length; i++){
            const result:DataScraperReturnDto[] = await this.scrapeData(product.urls[i]);

            for(let i = 0; i<result.length; i++){
                const vocEntity:VocEntity = VocEntity.create(result[i].getDescription(), result[i].getScore(), product.urls[i], result[i].getDate());
                await this.vocRepository.save(vocEntity);
                newVocEntityList.push(vocEntity);
            }
        }

        const vocTextList:string[] = await this.analyzeData(newVocEntityList, member);

        await this.extractKeywords(vocTextList, member, product);

        return "Success";
    }

    public async testDataScraping(url:string): Promise<String[]>{
        let resultList:String[] = [];
        const result:DataScraperReturnDto[] = await this.dataScrapingModuleMapping.get("Crawling")!.scrape(url, "OliveYoung", "");

        for(let i = 0; i< result.length; i++){
            resultList.push(result[i].getScore() + "/" + result[i].getDescription());
        }

        return resultList;
    }

    @Transactional()
    public async vocKeywordExtractionRefresh(productId:string): Promise<string>{
        const product:ProductEntity = await this.productRepository.findOneBy({id: productId});
        let vocTextList:string[] = [];
        const member:MemberEntity = await product.member;

        for(let i = 0; i<product.urls.length; i++){
            const vocList:VocEntity[] = await this.vocRepository.findBy({url: product.urls[i]});
            for(let j = 0; j<vocList.length; j++){
                vocTextList.push(vocList[j].description);
            }
        }

        console.log(vocTextList);

        await this.extractKeywords(vocTextList, member, product);

        return "true";
    }

    public async getVocByProductId(product_id:string): Promise<UrlVocListDto[]>{
        let urlVocList:UrlVocListDto[] = []
        const productEntity:ProductEntity = await this.productRepository.findOneBy({id: product_id});
        for(let i = 0; i<productEntity.urls.length; i++){
            const urlVocListDto:UrlVocListDto = new UrlVocListDto(productEntity.urls[i].url);
            const vocs:VocEntity[] = await this.vocRepository.findBy({url:productEntity.urls[i]});
            for(let i:number = 0; i<vocs.length; i++){
                const vocList:VocDto[] = [];
                urlVocListDto.vocs.push(VocDto.create(vocs[i]));
            };
            urlVocList.push(urlVocListDto);
        };
        return urlVocList;
    }

    public async getVocAnalysisByVocId(vocId: string): Promise<VocAnalysisEntity[]>{
      const voc = await this.vocRepository.findOneBy({id: vocId});
      const vocAnalysis = await this.vocAnalysisRepository.findBy({voc: voc});
      return vocAnalysis;
    };

    public async getVocAnalysisByProductId(productId: string): Promise<VocAnalysisEntity[]> {
        return this.vocAnalysisRepository.find({
            where: {
                voc: {
                    url: {
                        product: {
                            id: productId
                        }
                    }
                }
            },
            relations: ['voc', 'voc.url', 'voc.url.product', 'category']
        });
    }

    public async getVocAnalysisByProductIdAndDate(productId: string, startDate: Date, endDate: Date): Promise<VocAnalysisEntity[]> {
        return this.vocAnalysisRepository.find({
            where: {
                voc: {
                    url: {
                        product: {
                            id: productId
                        }
                    },
                    uploadedDate: Between(startDate, endDate)
                }
            },
            relations: ['voc', 'voc.url', 'voc.url.product', 'category']
        });
    }

    public async getVocKeywordsByProductId(productId: string):Promise<VocKeywordEntity[]>{
      const productEntity = await this.productRepository.findOneBy({id: productId});
      const vocKeywordEntities:VocKeywordEntity[] = await this.vocKeywordRepository.find({
        where: { product: productEntity },
        relations: ["product", "category"]
    });
      return vocKeywordEntities;
    };


    /**
     * 추출 메서드
     */

    //------------------------데이터 수집-----------------------//

    private async scrapeData(urlEntity:UrlEntity): Promise<DataScraperReturnDto[]>{
        let mostRecentData:string;

        const mostRecentVoc:VocEntity = await this.vocRepository.findOne({
            where: [{url: urlEntity}],
            order: {uploadedDate:'DESC', createdAt:'ASC'}
        });

        mostRecentVoc !=  null ? mostRecentData = mostRecentVoc.description : mostRecentData="";

        const result:DataScraperReturnDto[] = await this.dataScrapingModuleMapping.get("Crawling")!.scrape(urlEntity.url, "OliveYoung", mostRecentData);

        return result;
    }

    //---------------------VOC 데이터 불러오기--------------------//
    private async getVocByProduct(product:ProductEntity):Promise<VocEntity[]>{
        let vocEntityList:VocEntity[] = [];
        for(let i = 0; i<product.urls.length; i++){
            const voc:VocEntity[] = await this.vocRepository.findBy({url:product.urls[i]});
            voc.forEach((vocEntity) => {
                vocEntityList.push(vocEntity);
            });
        }
        return vocEntityList;
    }

    //---------------------VOC 분석 ------------------------//
    private async analyzeData(vocEntityList:VocEntity[], member:MemberEntity):Promise<string[]>{
        const categoryMap = new Map<string, CategoryEntity>();
        const categoryList:CategoryEntity[] = await this.categoryRepository.findBy({member:member});
        const vocTextList:string[] = [];

        for(let i = 0; i<categoryList.length; i++){
            categoryMap.set(categoryList[i].categoryName, categoryList[i]);
        }

       /*for(let i = 0; i<vocEntityList.length; i++){
            const classifiedCategoryList:string[] = await this.customOpenAI.categoryClassifier(vocEntityList[i].description, Array.from(categoryMap.keys()));
            const classifiedCategory:string = classifiedCategoryList[0];
            const sentiments:{category:string, sentiment:string} = await this.customOpenAI.sentimentAnalysis(vocEntityList[i].description, Array.from(categoryMap.keys()));
            let primarySentiment:SentimentEnum = null;
            if(sentiments[classifiedCategory] == "긍정"){
                primarySentiment = SentimentEnum.positive;
            } else{
                primarySentiment = SentimentEnum.negative;
            }

            const vocAnalysis:VocAnalysisEntity = VocAnalysisEntity.create(vocEntityList[i], categoryMap.get(classifiedCategory), primarySentiment, sentiments);
            await this.vocAnalysisRepository.save(vocAnalysis);
            vocTextList.push(vocEntityList[i].description);
        }*/

        let toBeProcessedVocEntityList:VocEntity[] = [];

        for(let i = 0; i<vocEntityList.length; i++){
            toBeProcessedVocEntityList.push(vocEntityList[i]);
            if(toBeProcessedVocEntityList.length == 1 || i == vocEntityList.length -1){
                const processedVocTextList:string[] = await Promise.all(toBeProcessedVocEntityList.map((vocEntity) => this.classifyVoc(vocEntity, categoryMap)));
                processedVocTextList.forEach((voc) => {
                    vocTextList.push(voc);
                });

                toBeProcessedVocEntityList = [];
            }
        }

        
        return vocTextList;
    }

    private async classifyVoc(vocEntity:VocEntity, categoryMap:Map<string, CategoryEntity>):Promise<string>{
        const classifiedCategoryList:string[] = await this.customOpenAI.categoryClassifier(vocEntity.description, Array.from(categoryMap.keys()));
        const classifiedCategory:string = classifiedCategoryList[0];
        const sentiments:{category:string, sentiment:string} = await this.customOpenAI.sentimentAnalysis(vocEntity.description, Array.from(categoryMap.keys()));
        let primarySentiment:SentimentEnum = null;
        if(sentiments[classifiedCategory] == "긍정"){
            primarySentiment = SentimentEnum.positive;
        } else{
            primarySentiment = SentimentEnum.negative;
        }
        const vocAnalysis:VocAnalysisEntity = VocAnalysisEntity.create(vocEntity, categoryMap.get(classifiedCategory), primarySentiment, sentiments);
        this.vocAnalysisRepository.save(vocAnalysis);
        return vocEntity.description;
    }

    private async extractKeywords(vocTextList:string[], member:MemberEntity, product:ProductEntity){
        const categoryList:CategoryEntity[] = await this.categoryRepository.findBy({member: member});

        for(let i = 0; i< categoryList.length; i++){
            const keywords:string[] = await this.customOpenAI.keywordExtraction(vocTextList, categoryList[i].categoryName);
            const vocKeyword:VocKeywordEntity = await this.vocKeywordRepository
                .createQueryBuilder("voc_keyword_entity")
                .where("\"productId\" = :productId AND \"categoryId\" = :categoryId", {productId:product.id, categoryId: categoryList[i].id})
                .getOne();

            if(vocKeyword == null){
                const newVocKeyword:VocKeywordEntity = new VocKeywordEntity(product, categoryList[i], keywords);
                await this.vocKeywordRepository.save(newVocKeyword);
            } else{
                console.log(vocKeyword.keywords);
                for(let i = 0; i< vocKeyword.keywords.length; i++){
                    if(!vocKeyword.keywords.includes(keywords[i])){
                        vocKeyword.keywords.push(keywords[i]);
                    }
                }
            }
        }
    }

    //-----------------------카테고리별 VOC 개수 종합----------------------------//
    private async sortVocByDate(vocList:VocEntity[]):Promise<VocByDateDto[]>{
        const dtoByDateMap:Map<Date,VocByDateDto> = new Map();

        for(let i = 0; i<vocList.length; i++){
            if(!dtoByDateMap.has(vocList[i].uploadedDate)){
                dtoByDateMap.set(vocList[i].uploadedDate, new VocByDateDto(vocList[i].uploadedDate, []));
            }
            dtoByDateMap.get(vocList[i].uploadedDate).vocs.push(vocList[i]);
        }

        return Array.from(dtoByDateMap.values());
    }

    private async sortVocByWeek(vocList:VocEntity[]):Promise<VocByDateDto[]>{
        const dtoByDateMap:Map<number,VocByDateDto> = new Map();
        const sortedDtoByDateMap:Map<Date, VocByDateDto> = new Map();

        for(let i = 0; i<vocList.length; i++){
            let day:number = vocList[i].uploadedDate.getDay()-1;

            if(day<0){
                day = day +7
            }

            let date:Date = new Date(vocList[i].uploadedDate);
            date.setDate(date.getDate() - day);

            if(!dtoByDateMap.has(date.valueOf())){
                dtoByDateMap.set(date.valueOf(), new VocByDateDto(date, []));
            }
            dtoByDateMap.get(date.valueOf()).vocs.push(vocList[i]);
        }

        const keysArray:number[] = Array.from(dtoByDateMap.keys()).sort().reverse();
        console.log(keysArray);
        for(let i = 0; i< keysArray.length; i++){
            sortedDtoByDateMap.set(new Date(keysArray[i]), dtoByDateMap.get(keysArray[i]));
        }


        return Array.from(sortedDtoByDateMap.values());
    }

    private async countVocByCategory(vocList:VocByDateDto[]):Promise<VocCountPerCategoryDto[]>{
        let resultMap:Map<string,VocCountPerCategoryDto> = new Map();

        for(let i = 0; i<vocList.length; i++){
            let countPerCategory:Map<string, number[]> = new Map();
            let vocs = vocList[i].vocs;

            for(let j = 0 ; j < vocs.length; j++){
                const vocEntity:VocEntity = vocs[j];
                const vocAnalysis:VocAnalysisEntity = vocEntity.vocAnalysis;
                const category:CategoryEntity = vocAnalysis.category;
                const categoryName:string = category.categoryName;

                if(!resultMap.has(categoryName)){
                    resultMap.set(categoryName, new VocCountPerCategoryDto(category.categoryName, category.id));
                }

                if(!countPerCategory.has(categoryName)){
                    countPerCategory.set(categoryName, [0,0]);
                }

                if(vocAnalysis.primarySentiment == SentimentEnum.positive){
                    countPerCategory.get(categoryName)[0]++;
                } else if(vocAnalysis.primarySentiment == SentimentEnum.negative){
                    countPerCategory.get(categoryName)[1]++;
                }
            }

            const categoryArray:string[] = Array.from(countPerCategory.keys());
            for(let j = 0; j<categoryArray.length; j++){
                const countArray:number[] = countPerCategory.get(categoryArray[j]);
                resultMap.get(categoryArray[j]).vocCountList.push(new VocCountPerWeekDto(vocList[i].date.toLocaleString(), countArray[0], countArray[1]));
            }
        }


        return Array.from(resultMap.values());
    }
}