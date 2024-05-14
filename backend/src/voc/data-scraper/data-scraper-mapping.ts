import { Injectable } from "@nestjs/common";
import { CrawlingDataScrapingModule } from "./crawling-data-scraper/crawling-data-scraper";
import { DataScrapingModule } from "./data-scraper";

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