import { DataCrawler } from "./data-crawler";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export class OliveYoundDataCrawler implements DataCrawler{

    constructor(){};

    public async crawl(url: string): Promise<string[]> {
        console.log(url + " Start!");
        const delayAfterScroll:number = 2000;
        const userAgent:string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
        let counter:number = 1;
        let resultArray:string[] = [];
        let isNextPage = true;
        let endNum = -1;
        let isLastSection = false;
        let init = true;
        
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            headless: true,
            args: [
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--no-sandbox",
                "--headless",
                "--enable-chrome-browser-cloud-management"
            ]
        });

        let page = await browser.newPage();

        await page.setUserAgent(userAgent);

        await page.setViewport({
            width : 1280               // 페이지 너비
          , height : 720                // 페이지 높이
          , deviceScaleFactor : 1     // 기기 배율 요소를 지정 DPR( Device Pixel Resolution )
          , isMobile : false            // 모바일
          , hasTouch : false           // 터치 이벤트 발생여부
          , isLandscape : false        //
      });

        console.log("Browser Created");

        await page.goto(url);

        await page.click(".goods_reputation");
        await page.waitForSelector(".review_list_wrap > .inner_list > li > .review_cont");

        while(isNextPage == true){
            let content = await page.content();
            let data = cheerio.load(content);
            let moveToNextPage = false;
            let nextSectionButton = data("#gdasContentsArea > div > div.pageing > a.next").text();
            //console.log("NextSection Button: " + nextSectionButton.length);

            if(endNum == -1){
                if(data("#gdasContentsArea > div > div.pageing > a.next").text().length == 0){
                    isLastSection = true;
                    endNum = data('div.pageing>a').toArray().length + 1;
                    console.log("Last Section");
                } else{
                    endNum = 10;
                }
            } else if(endNum<counter && !isLastSection){
                moveToNextPage = true;
            }

            if(moveToNextPage){
                console.log("Next Page");
                await page.waitForSelector("#gdasContentsArea > div > div.pageing > a.next");
                const nextPageButton = await page.$("#gdasContentsArea > div > div.pageing > a.next");
                await page.mouse.wheel({deltaY:5000});
                await sleep(delayAfterScroll);
                const coord = await page.evaluate(response=>{
                    let x = response?.getBoundingClientRect().x;
                    let y = response?.getBoundingClientRect().y;
                    return {x, y};
                }, nextPageButton);
                //console.log(coord);
                await page.mouse.click(coord.x!, coord.y!);
                await sleep(1000);
                await page.waitForSelector(".review_list_wrap > .inner_list > li > .review_cont");
                content = await page.content();
                data = cheerio.load(content);
                endNum = data('div.pageing>a').toArray().length;
                counter = 2;

                await page.waitForSelector("#gdasContentsArea > div > div.pageing");

                if(data("#gdasContentsArea > div > div.pageing > a.next").text().length == 0){
                    endNum = endNum + 1;
                    isLastSection = true;
                    console.log("Last Section");
                }
            }

            const reviews = data('div.review_list_wrap > .inner_list > li > div.review_cont').toArray();
            //console.log("EndNum: " + endNum);
            for(let i = 0; i<reviews.length; i++){
                let eachReview = data(reviews[i]);
                let point = eachReview.find('.point').text();
                let review = eachReview.find('.txt_inner').text();
                let maxPoint = point.charAt(0)
                let userPoint = point.charAt(6);

                let convertedPoint = (100 / Number(maxPoint)) * Number(userPoint);
                console.log(point, review);
                resultArray.push(convertedPoint + "%" + review);
            }

            counter = counter +1;

            if(counter<=endNum){
                await page.mouse.wheel({deltaY:10000});
                await sleep(delayAfterScroll);
                await page.waitForSelector("#gdasContentsArea > div > div.pageing > a:nth-child("+counter+")");
                const nextPageButton = await page.$("#gdasContentsArea > div > div.pageing > a:nth-child("+counter+")");
                let coord = await page.evaluate(response=>{
                    let x = response?.getBoundingClientRect().x;
                    let y = response?.getBoundingClientRect().y;
                    return {x, y};
                }, nextPageButton);

                if(init){
                    await page.waitForSelector("#gdasContentsArea > div > div.pageing > a:nth-child("+counter+")");
                    const nextPageButton = await page.$("#gdasContentsArea > div > div.pageing > a:nth-child("+counter+")");
                    coord = await page.evaluate(response=>{
                        let x = response?.getBoundingClientRect().x;
                        let y = response?.getBoundingClientRect().y;
                    return {x, y};
                    }, nextPageButton);
                    init = false;
                }

                //console.log(coord);
                //console.log("counter: " + counter + ", endNum: " + endNum);
                await page.mouse.click(coord.x!, coord.y!);
                await sleep(200);
                await page.waitForSelector(".review_list_wrap > .inner_list > li > .review_cont");
            }

            if(counter>endNum && isLastSection){
                isNextPage = false;
                break;
            }

        }

        browser.close();

        console.log(url + "done");

        return resultArray;
    }

}
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}