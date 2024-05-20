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
    

}