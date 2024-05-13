import { Injectable } from "@nestjs/common";
import { CrawlingDataScrapingModule } from "./crawling_data_scraping_module/CrawlingDataScrapingModule";
import { DataScrapingModule } from "./DataScrapingModule";

@Injectable()
export class DataScrapingModuleMapping{
    moduleMap = new Map<String, DataScrapingModule>([
        ["Crawling", new CrawlingDataScrapingModule()]
    ]);

    constructor(){};

    public get(type:string){
        return this.moduleMap.get(type);
    }

}