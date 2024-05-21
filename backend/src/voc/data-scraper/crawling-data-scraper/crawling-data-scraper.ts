import { DataScrapingModule } from "../data-scraper";
import { DataScraperReturnDto } from "../data-scraper-return.dto";
import { DataCrawlerMapping } from "./data-crawler/data-crawler-mapping";

export class CrawlingDataScrapingModule implements DataScrapingModule{

    dataCrawlerMapping = new DataCrawlerMapping();

    public scrape(url: string, domain: string, mostRecentData): Promise<DataScraperReturnDto[]> {
        return this.dataCrawlerMapping.get(domain)!.crawl(url, mostRecentData);
    }

}