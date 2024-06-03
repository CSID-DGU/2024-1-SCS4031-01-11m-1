import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { VocService } from "../service/voc.service";
import { TestDataScrapingRequestDto } from "./controller-dto/test-data-scraping/test-data-scraping-request.dto";
import { UrlVocListDto } from "./controller-dto/get-voc-by-productId/url-voc-list.dto";
import { GetVocByProductIdResponseDto } from "./controller-dto/get-voc-by-productId/get-voc-by-productId-response.dto"

@ApiTags('VOC Data Controller')
@Controller('/voc')
export class VocController{

    constructor(
        private vocService: VocService
    ){}

    @Get("/getByProductId/:productId")
    public async getVocByProductId(@Param("productId") productId:string){
        const vocList:UrlVocListDto[] = await this.vocService.getVocByProductId(productId);
        return new GetVocByProductIdResponseDto(vocList)
    }

    //-----------------------------------VOC 업데이트-------------------------------------------//
    @ApiOperation({summary: "크롤링 테스트"})
    @Post("/test/datascraping")
    public async testDataScraping(@Body() dataScrapRequestDto: TestDataScrapingRequestDto):Promise<String>{
        const result:String[] = await this.vocService.testDataScraping(dataScrapRequestDto.getUrl());
        return result[0];
    }

    @ApiOperation({summary: "Url 엔티티 Id를 통해 Voc 업데이트"})
    @Post("/updateVocByUrlId/:urlId")
    public async updateVocByUrlId(@Param("urlId") urlId:string){
        return this.vocService.scrapeDataByUrlId(urlId);
    }

    @ApiOperation({summary: "Product 엔티티 Id를 통해 Voc 업데이트"})
    @Post("/updateVocByProductId/:productId")
    public async updateVocByProductId(@Param("productId") productId:string){
        return this.vocService.scrapeDataByProductId(productId);
    }

    @ApiOperation({summary: "VOC 키워드 추출 리프레시(테스트용)"})
    @Post("/refresh/vockeywords/:productId")
    public async refreshVocKeywords(@Param("productId") productId:string){
        return this.vocService.vocKeywordExtractionRefresh(productId);
    }

    //-------------------------------------VOC 데이터 가져오기------------------------------------//
    @ApiOperation({summary: "카테고리별 VOC 건수 불러오기"})
    @Get("/count/:productId")
    public async getVocCountPerCategory(@Param("productId") productId:string){
        return this.vocService.getVocCountPerCategory(productId);
    }

    @ApiOperation({summary: "멤버ID로 VOC 건수 불러오기"})
    @Get("/count/:memberId")
    public async getVocCountByMemberId(@Param("memberId") memberId:string){
        return this.vocService.getVocCountByMemberId(memberId);
    }
}