import { DataScrapingModule } from "../data-scraper";
import { DataCrawlerMapping } from "./data-crawler/data-crawler-mapping";

export class CrawlingDataScrapingModule implements DataScrapingModule{

    dataCrawlerMapping = new DataCrawlerMapping();

    public scrape(url: string, domain: string): Promise<string[]> {
        return this.dataCrawlerMapping.get(domain)!.crawl(url);
    }

}