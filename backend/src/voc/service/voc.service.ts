import { Injectable } from "@nestjs/common";
import { DataScrapingModuleMapping } from "../data-scraper/data-scraper-mapping";
import { InjectRepository } from "@nestjs/typeorm";
import { VocEntity } from "../entity/voc.entity";
import { Repository, QueryFailedError } from 'typeorm';
import { UrlEntity } from "src/member-data/products/entities/url.entity";
import { ProductEntiy } from "src/member-data/products/entities/product.entity";

@Injectable()
export class VocService{
    constructor(
        private dataScrapingModuleMapping: DataScrapingModuleMapping,
        
        @InjectRepository(VocEntity)
        private readonly vocRepository: Repository<VocEntity>,

        @InjectRepository(UrlEntity)
        private readonly urlRepository: Repository<UrlEntity>,

        @InjectRepository(ProductEntiy)
        private readonly productRepository: Repository<ProductEntiy>

    ){}

    /**
     * Voc데이터 수집
     */
    public async scrapeDataByUrlId(url_id:string): Promise<String>{
        await this.scrapeData(url_id);
        return "Success";
    }

    /*public async scrapeDataByProductId(product_id:string): Promise<String>{
        const productEntity:ProductEntiy = await this.productRepository.findOneBy({id:product_id});

        const result = await this.dataScrapingModuleMapping.get("Crawling")!.scrape(p, "OliveYoung");

        for(let i = 0; i<result.length; i++){
            let text = result[i].split("%");
            const vocEntity:VocEntity = VocEntity.create(text[1], Number(text[0]), urlEntity);
            await this.vocRepository.save(vocEntity);
        }

        return "Success";
    }*/

    public async testDataScraping(url:string): Promise<String[]>{
        let resultList:String[] = [];
        const result = await this.dataScrapingModuleMapping.get("Crawling")!.scrape(url, "OliveYoung", "");

        for(let i = 0; i< result.length; i++){
            resultList.push(result[i].getScore() + "/" + result[i].getDescription());
        }

        return resultList;
    }

    private async scrapeData(url_id:string): Promise<string>{
        const urlEntity: UrlEntity = await this.urlRepository.findOneBy({id: url_id});
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