import {DataScraperReturnDto} from "./data-scraper-return.dto"

export interface DataScrapingModule{
    scrape(url:string, domain:string, mostRecentData:string):Promise<DataScraperReturnDto[]>;
}