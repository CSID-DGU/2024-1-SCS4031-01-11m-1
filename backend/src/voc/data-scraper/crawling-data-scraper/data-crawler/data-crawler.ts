export interface DataCrawler{
    crawl(url:string):Promise<string[]>;
}