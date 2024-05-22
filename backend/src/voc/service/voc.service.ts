import { Injectable } from "@nestjs/common";
import { DataScrapingModuleMapping } from "../data-scraper/data-scraper-mapping";
import { InjectRepository } from "@nestjs/typeorm";
import { VocEntity } from "../entity/voc.entity";
import { Repository, QueryFailedError } from 'typeorm';
import { UrlEntity } from "src/member-data/products/entities/url.entity";
import { ProductEntity } from "src/member-data/products/entities/product.entity";
import { UrlVocListDto } from "src/voc/controller/controller-dto/get-voc-by-productId/url-voc-list.dto"
import { VocDto } from "../dto/voc.dto";

@Injectable()
export class VocService{
    constructor(
        private dataScrapingModuleMapping: DataScrapingModuleMapping,
        
        @InjectRepository(VocEntity)
        private readonly vocRepository: Repository<VocEntity>,

        @InjectRepository(UrlEntity)
        private readonly urlRepository: Repository<UrlEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>

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

        console.log(productEntity.urls);

        for(let i:number = 0; i<productEntity.urls.length; i++){
            await this.scrapeData(productEntity.urls[i]);
        }

        return "Success";
    }

    public async testDataScraping(url:string): Promise<String[]>{
        let resultList:String[] = [];
        const result = await this.dataScrapingModuleMapping.get("Crawling")!.scrape(url, "OliveYoung", "");

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

    private async scrapeData(urlEntity:UrlEntity): Promise<string>{
        let mostRecentData:string;

        const mostRecentVoc:VocEntity = await this.vocRepository.findOne({
            where: [{url: urlEntity}],
            order: {uploadedDate:'DESC', createdAt:'ASC'}
        });

        mostRecentVoc !=  null ? mostRecentData = mostRecentVoc.description : mostRecentData="";

        console.log(mostRecentData);

        const result = await this.dataScrapingModuleMapping.get("Crawling")!.scrape(urlEntity.url, "OliveYoung", mostRecentData);

        for(let i = 0; i<result.length; i++){
            const vocEntity:VocEntity = VocEntity.create(result[i].getDescription(), result[i].getScore(), urlEntity, result[i].getDate());
            await this.vocRepository.save(vocEntity);
        }

        return "Success";
    }
}