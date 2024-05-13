import { Injectable } from "@nestjs/common";
import { DataScrapingModuleMapping } from "../data_scraping_module/DataScrapingModuleMapping";

@Injectable()
export class VocService{
    constructor(
        private dataScrapingModuleMapping: DataScrapingModuleMapping
    ){}

    public renewVoc(productId: number){

    }

    public async testDataScraping(url:string): Promise<String[]>{
        let resultList:String[] = [];
        const result = await this.dataScrapingModuleMapping.get("Crawling")!.scrape(url, "OliveYoung");

        for(let i = 0; i< result.length; i++){
            let text = result[i].split("%");
            resultList.push(text[0] + "/" + "text[1");
        }

        return resultList;
    }
}