import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddProductDto } from './dtos/add-product.dto';
import { Member } from 'src/auth/get-member-decorator';
import { MemberEntity } from 'src/auth/member.entity';
import { MemberDataService } from './member-data.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntiy } from './entities/product.entity';

@ApiTags('Member Data Controller')
@Controller('/member-data')
export class MemberDataController {
  constructor(
    private memberDataService: MemberDataService,
  ){};

  @ApiOperation({ summary: 'member id로 상품 리스트를 가져옵니다.' })
  @Get('/products/:memberId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  async loadProducts(
    @Member() member: MemberEntity
    ):Promise<ProductEntiy[]>{
      return this.memberDataService.loadProducts(member.memberId);
   };

  @ApiOperation({ summary: '상품데이터를 등록합니다.' })
  @Post('/add-product')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  async addProduct(
    @Body() addProductDto: AddProductDto,
    @Member() member: MemberEntity
    ):Promise<void>{
      this.memberDataService.addProduct(addProductDto, member.memberId);
    };
  
  @ApiOperation({ summary: '상품데이터를 삭제합니다.' })
  @Delete('/delete-product/:productId')
  @ApiParam({
    name: 'productId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  async deleteProduct(
    @Param('productId') productId
  ): Promise<void>{
    this.memberDataService.deleteProduct(productId);
  };

  @ApiOperation({ summary: '상품데이터를 업데이트합니다.' })
  @Patch(('/update-product/:productId'))
  @ApiParam({
    name: 'productId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('productId') productId
  ):Promise<void>{
    this.memberDataService.updateProduct(productId, updateProductDto);
  };
}
