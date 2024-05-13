import { DataCrawler } from "./DataCrawler";
import { OliveYoundDataCrawler } from "./OliveYoundDataCralwer";

export class DataCrawlerMapping{
    crawlMap = new Map<String, DataCrawler>([
        ["OliveYoung", new OliveYoundDataCrawler()]
    ]);

    constructor(){};

    public get(domain:string){
        return this.crawlMap.get(domain);
    }

}