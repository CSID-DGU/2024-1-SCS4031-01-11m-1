import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddProductDto } from './dtos/add-product.dto';
import { Member } from 'src/auth/get-member-decorator';
import { MemberEntity } from 'src/auth/member.entity';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ApiExceptionResponse } from 'src/utils/exception-response.decorater';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer.options.factory';
import { ApiAddImageFile, ApiUpdateImageFile, ApiaddMinuteFile } from 'src/utils/api-file.decorator';
import { AddProductMinuteDto } from './dtos/add-product-minute.dto';
import { ProductMinuteEntity } from './entities/product-minute.entity';
import { UrlEntity } from './entities/url.entity';

@ApiTags('Member Data -products- Controller')
@Controller('/member-data')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
  ){};

  @ApiOperation({ summary: 'member id로 상품 리스트를 가져옵니다.' })
  @Get('/products/:memberId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  async loadProducts(
    @Member() member: MemberEntity
    ):Promise<ProductEntity[]>{
      return await this.productsService.loadProducts(member.memberId);
   };

   @ApiOperation({ summary: 'product id로 상품url 리스트를 가져옵니다.' })
   @ApiParam({
    name: 'productId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 product id를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 상품 url리스트를 가져오는 중 예상치 못한 에러가 발생했습니다.`,
  )
   @Get('/product-url/:productId')
   async loadProductUrls(
    @Param('productId') productId
   ):Promise<UrlEntity[]>{
    return await this.productsService.loadProductUrls(productId);
   }

  @ApiOperation({ summary: '상품데이터를 등록합니다.' })
  @Post('/add-product')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('productImage', multerOptions('files')))
  @ApiAddImageFile('productImage')
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 member id를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 상품데이터를 추가하는 중 예상치 못한 에러가 발생했습니다.`,
  )
  async addProduct(
    @Body() addProductDto: AddProductDto,
    @UploadedFile() productImage: Express.Multer.File,
    @Member() member: MemberEntity
    ):Promise<void>{
      console.log(productImage);
      await this.productsService.addProduct(addProductDto, member.memberId, productImage);
    };

  @ApiOperation({ summary: '상품데이터를 삭제합니다.' })
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 product id를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 상품데이터를 삭제하는 중 예상치 못한 에러가 발생했습니다.`,
  )
  @Delete('/delete-product/:productId')
  @ApiParam({
    name: 'productId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  async deleteProduct(
    @Param('productId') productId
  ): Promise<void>{
    await this.productsService.deleteProduct(productId);
  };

  @ApiOperation({ summary: '상품데이터를 업데이트합니다.' })
  @Patch(('/update-product/:productId'))
  @UseInterceptors(FileInterceptor('productImage', multerOptions('files')))
  @ApiUpdateImageFile('productImage')
  @ApiParam({
    name: 'productId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 product id를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 상품데이터를 업데이트하는 중 예상치 못한 에러가 발생했습니다.`,
  )
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() productImage: Express.Multer.File,
    @Param('productId') productId
  ):Promise<void>{
    await this.productsService.updateProduct(productId, updateProductDto, productImage);
  };

  @ApiOperation({ summary: '상품회의록을 등록합니다.' })
  @Post('/add-product-minute')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('productMinute', multerOptions('files')))
  @ApiaddMinuteFile('productMinute')
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 member id를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 상품회의록을 추가하는 중 예상치 못한 에러가 발생했습니다.`,
  )
  async addProductMinute(
    @Body() addProductMinuteDto: AddProductMinuteDto,
    @UploadedFile() productMinute: Express.Multer.File,
    @Member() member: MemberEntity
  ):Promise<void>{
    const { productMinuteName } = addProductMinuteDto;
    await this.productsService.addProductMinute(productMinuteName, member.memberId, productMinute);
  };

  @ApiOperation({ summary: 'member id로 회의록 리스트를 가져옵니다.' })
  @Get('/product-minutes/:memberId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  async loadProductMinutes(
    @Member() member: MemberEntity
  ):Promise<ProductMinuteEntity[]>{
    return await this.productsService.loadProductMintes(member.memberId);
  };

  @ApiOperation({ summary: '회의록을 삭제합니다.' })
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 회의록 id를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 회의록을 삭제하는 중 예상치 못한 에러가 발생했습니다.`,
  )
  @Delete('/delete-product-minute/:productMinuteId')
  @ApiParam({
    name: 'productMinuteId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  async deleteProductMinute(
    @Param('productMMinuteId') productMinuteId
  ):Promise<void>{
    await this.productsService.deleteProductMinute(productMinuteId);
  };
}
