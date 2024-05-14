import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { VocService } from "../service/voc.service";

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
    @Post("/test/datascraping/:url")
    public async testDataScraping(@Param("url") url: string):Promise<String[]>{
        return this.vocService.testDataScraping(url);
    }
    

}