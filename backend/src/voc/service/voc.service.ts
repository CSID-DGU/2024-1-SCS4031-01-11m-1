import { Injectable } from "@nestjs/common";
import { DataScrapingModuleMapping } from "../data-scraper/data-scraper-mapping";
import { InjectRepository } from "@nestjs/typeorm";
import { VocEntity } from "../entity/voc.entity";
import { Repository, QueryFailedError } from 'typeorm';
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

        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,

        @InjectRepository(VocKeywordEntity)
        private readonly vocKeywordRepository: Repository<VocKeywordEntity>,

        private readonly customOpenAI:CustomOpenAI
    ){}

    /**
     * Voc데이터 수집
     */
    public async scrapeDataByUrlId(url_id:string): Promise<String>{
        const urlEntity: UrlEntity = await this.urlRepository.findOneBy({id: url_id});

        await this.scrapeData(urlEntity);

        return "Success";
    }

    public async scrapeDataByProductId(product_id:string): Promise<String>{
        const product:ProductEntity = await this.productRepository.findOneBy({id: product_id});
        const newVocEntityList:VocEntity[] = [];
        const member:MemberEntity = await product.member;

        for(let i:number = 0; i<product.urls.length; i++){
            const url:UrlEntity = product.urls[i];
            console.log(url);
            const result:DataScraperReturnDto[] = await this.scrapeData(url);

            for(let i = 0; i<result.length; i++){
                const vocEntity:VocEntity = VocEntity.create(result[i].getDescription(), result[i].getScore(), url, result[i].getDate());
                await this.vocRepository.save(vocEntity);
                newVocEntityList.push(vocEntity);
            }
        }

        const vocTextList:string[] = await this.analyzeData(newVocEntityList, member);

        console.log("---------------------")
        console.log(vocTextList);

        await this.extractKeywords(vocTextList, member, product);

        return "Success";
    }

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
            }
            urlVocList.push(urlVocListDto);
        }

        return urlVocList;
    }


    //------------------------데이터 수집-----------------------//

    private async scrapeData(urlEntity:UrlEntity): Promise<DataScraperReturnDto[]>{
        let mostRecentData:string;

        const mostRecentVoc:VocEntity = await this.vocRepository.findOne({
            where: [{url: urlEntity}],
            order: {uploadedDate:'DESC', createdAt:'ASC'}
        });

        mostRecentVoc !=  null ? mostRecentData = mostRecentVoc.description : mostRecentData="";

        console.log(mostRecentData);

        const result:DataScraperReturnDto[] = await this.dataScrapingModuleMapping.get("Crawling")!.scrape(urlEntity.url, "OliveYoung", mostRecentData);

        return result;
    }

    //---------------------VOC 분석 ------------------------/
    private async analyzeData(vocEntityList:VocEntity[], member:MemberEntity):Promise<string[]>{
        const categoryMap = new Map<string, CategoryEntity>();
        const categoryList:CategoryEntity[] = await this.categoryRepository.findBy({member:member});
        let vocTextList:string[] = [];

        for(let i = 0; i<categoryList.length; i++){
            categoryMap.set(categoryList[i].categoryName, categoryList[i]);
        }

        for(let i = 0; i<vocEntityList.length; i++){
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
        }

        return vocTextList;

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
}