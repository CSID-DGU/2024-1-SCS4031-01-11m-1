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
        const productEntity:ProductEntity = await this.productRepository.findOneBy({id: product_id});
        const newVocEntityList:VocEntity[] = [];
        const member:MemberEntity = await productEntity.member;

        for(let i:number = 0; i<productEntity.urls.length; i++){
            const result:DataScraperReturnDto[] = await this.scrapeData(productEntity.urls[i]);

            for(let i = 0; i<result.length; i++){
                const vocEntity:VocEntity = VocEntity.create(result[i].getDescription(), result[i].getScore(), productEntity.urls[i], result[i].getDate());
                await this.vocRepository.save(vocEntity);
                newVocEntityList.push(vocEntity);
            }
        }

        this.analyzeData(newVocEntityList, member);

        return "Success";
    }

    public async scrapeDataByProductEntity(productEntity:ProductEntity): Promise<String>{
        const newVocEntityList:VocEntity[] = [];

        console.log(productEntity.urls);

        for(let i:number = 0; i<productEntity.urls.length; i++){
            const result:DataScraperReturnDto[] = await this.scrapeData(productEntity.urls[i]);

            for(let i = 0; i<result.length; i++){
                const vocEntity:VocEntity = VocEntity.create(result[i].getDescription(), result[i].getScore(), productEntity.urls[i], result[i].getDate());
                await this.vocRepository.save(vocEntity);
                newVocEntityList.push(vocEntity);
            }
        }

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
    private async analyzeData(vocEntityList:VocEntity[], member:MemberEntity){
        const categoryMap = new Map<string, CategoryEntity>();
        const categoryList:CategoryEntity[] = await this.categoryRepository.findBy({member:member});

        for(let i = 0; i<categoryList.length; i++){
            categoryMap.set(categoryList[i].categoryName, categoryList[i]);
        }

        for(let i = 0; i<vocEntityList.length; i++){
            const classifiedCategoryList:string[] = await this.customOpenAI.categoryClassifier(vocEntityList[i].description, Array.from(categoryMap.keys()));
            const classifiedCategory:string = classifiedCategoryList[0];
            console.log("Keys: " + Array.from(categoryMap.keys()));
            console.log("Classified Category" + classifiedCategory)
            console.log("Classifice CategoryEntity: " + categoryMap.get(classifiedCategory).categoryName)
            const sentiments:{category:string, sentiment:string} = await this.customOpenAI.sentimentAnalysis(vocEntityList[i].description, Array.from(categoryMap.keys()));
            let primarySentiment:SentimentEnum = null;
            if(sentiments[classifiedCategory] == "긍정"){
                primarySentiment = SentimentEnum.positive;
            } else{
                primarySentiment = SentimentEnum.negative;
            }

            const vocAnalysis:VocAnalysisEntity = VocAnalysisEntity.create(vocEntityList[i], categoryMap.get(classifiedCategory), primarySentiment, sentiments);
            await this.vocAnalysisRepository.save(vocAnalysis);
        }

    }
}