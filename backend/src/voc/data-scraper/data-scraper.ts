export interface DataScrapingModule{
    scrape(url:string, domain:string):Promise<string[]>;
}