import { DataScrapingModule } from "../DataScrapingModule";
import { DataCrawlerMapping } from "./data_crawler/DataCrawlerMapping";

export class CrawlingDataScrapingModule implements DataScrapingModule{

    dataCrawlerMapping = new DataCrawlerMapping();

    public scrape(url: string, domain: string): Promise<string[]> {
        return this.dataCrawlerMapping.get(domain)!.crawl(url);
    }

}