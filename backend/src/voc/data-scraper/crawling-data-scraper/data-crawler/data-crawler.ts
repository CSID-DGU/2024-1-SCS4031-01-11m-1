import { DataScraperReturnDto } from "../../data-scraper-return.dto";

export interface DataCrawler{
    crawl(url:string, mostRecentData):Promise<DataScraperReturnDto[]>;
}