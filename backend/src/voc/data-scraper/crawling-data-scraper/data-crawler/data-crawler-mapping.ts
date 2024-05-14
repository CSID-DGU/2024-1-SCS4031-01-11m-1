import { DataCrawler } from "./data-crawler";
import { OliveYoundDataCrawler } from "./olive-young-data-crawler";

export class DataCrawlerMapping{
    crawlMap = new Map<String, DataCrawler>([
        ["OliveYoung", new OliveYoundDataCrawler()]
    ]);

    constructor(){};

    public get(domain:string){
        return this.crawlMap.get(domain);
    }

}