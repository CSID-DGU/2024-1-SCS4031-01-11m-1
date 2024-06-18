import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TestDataScrapingRequestDto } from "./controller-dto/test-data-scraping/test-data-scraping-request.dto";
import { UrlVocListDto } from "./controller-dto/get-voc-by-productId/url-voc-list.dto";
import { GetVocByProductIdResponseDto } from "./controller-dto/get-voc-by-productId/get-voc-by-productId-response.dto"
import { VocService } from "../service/voc.service";
import { RefreshAnalyzedVocByDateAndProductsDto } from "./controller-dto/get-voc-by-productId/refresh-analyzed-voc-by-date-and-products.dto";
import { AuthGuard } from "@nestjs/passport";
import { Member } from "src/auth/get-member-decorator";
import { MemberEntity } from "src/auth/member.entity";

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
        await this.vocService.scrapeDataByProductId(productId);
        return this.vocService.analyzeVocByProductId(productId);
    }

    @ApiOperation({summary: "VOC 키워드 추출 리프레시(테스트용)"})
    @Post("/refresh/vockeywords/:productId")
    public async refreshVocKeywords(@Param("productId") productId:string){
        return this.vocService.vocKeywordExtractionRefresh(productId);
    }

    @ApiOperation({summary: "카테고리 추가했을 때 voc 분석내용 업데이트 - 상품, 날짜 선택"})
    @Post("/refresh/voc-analysis-when-add-category/:memberId")
    @UseGuards(AuthGuard())
    @ApiBearerAuth('access-token')
    public async refreshAnalyzedVocByDateAndProducts(@Body() refreshAnalyzedVocByDateAndProductsDto:RefreshAnalyzedVocByDateAndProductsDto, @Member() member: MemberEntity){
        const {productIds, startDate, endDate} = refreshAnalyzedVocByDateAndProductsDto
        return this.vocService.refreshAnalyzedVocByDateAndProducts(startDate, endDate, productIds, member.memberId)
    }

    //-------------------------------------VOC 데이터 가져오기------------------------------------//
    @ApiOperation({summary: "카테고리별 VOC 건수 불러오기"})
    @Get("/count/productId/:productId")
    public async getVocCountPerCategory(@Param("productId") productId:string){
        return this.vocService.getVocCountPerCategory(productId);
    }

    @ApiOperation({summary: "멤버ID로 VOC 건수 불러오기"})
    @Get("/count/member/:memberId")
    public async getVocCountByMemberId(@Param("memberId") memberId:string){
        return this.vocService.getVocCountByMemberId(memberId);
    }

    @ApiOperation({summary: "멤버ID로 카테고리별 최신 VOC 10건 불러오기"})
    @Get("/get/latest/:memberId")
    public async getLatest10VocByMemberId(@Param("memberId") memberId:string){
        return this.vocService.getLatest10VocByMemberId(memberId);
    }

    @ApiOperation({summary: "멤버ID와 카테고리ID로 해당 카테고리의 최신 VOC 10건 불러오기"})
    @Get("/get/latest/:memberId/:categoryId")
    public async getLatest10VocByMemberIdAndCategoryId(@Param("memberId") memberId:string, @Param("categoryId") categoryId:string){
        return this.vocService.getLatest10VocByMemberIdAndCategoryId(memberId, categoryId);
    }
}