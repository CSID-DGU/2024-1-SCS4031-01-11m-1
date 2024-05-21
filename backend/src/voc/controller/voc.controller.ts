import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { VocService } from "../service/voc.service";
import { TestDataScrapingRequestDto } from "./controller-dto/test-data-scraping-request.dto";

@ApiTags('Member Data Controller')
@Controller('/voc')
export class VocController{

    constructor(
        private vocService: VocService
    ){}


    @Get("/get/:vocId")
    public getVoc(@Param("vodId") vocId: number){

    }

    @Post("/renew/:productId")
    public renewVocData(@Param("productId") productId: number){

    }

    @ApiOperation({summary: "크롤링 테스트"})
    @Post("/test/datascraping")
    public async testDataScraping(@Body() dataScrapRequestDto: TestDataScrapingRequestDto):Promise<String>{
        const result:String[] = await this.vocService.testDataScraping(dataScrapRequestDto.getUrl());
        return result[0];
    }

    /*@ApiOperation({summary: "크롤링 실행"})
    @Post("/updateVoc/:productId")
    public async updateVoc(@Param("productId") productId: number){
        return await this.vocService.scrapeData(productId);
    }*/

    @ApiOperation({summary: "Url 엔티티 Id를 통해 Voc 업데이트"})
    @Post("/updateVocByUrlId/:urlId")
    public async updateVocByUrlId(@Param("urlId") urlId:string){
        return this.vocService.scrapeDataByUrlId(urlId);
    }
    

}