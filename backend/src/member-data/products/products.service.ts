import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductEntiy } from './entities/product.entity';
import { Repository, QueryFailedError } from 'typeorm';
import { UrlEntity } from './entities/url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductDto } from './dtos/add-product.dto';
import { AuthService } from 'src/auth/auth.service';
import { DtoToEntityMapper } from './mapper/products.mapper';
import { Transactional } from 'typeorm-transactional';
import { UpdateProductDto } from './dtos/update-product.dto';
import { MemberEntity } from 'src/auth/member.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntiy)
    private readonly productRepository: Repository<ProductEntiy>,
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
    private readonly authService: AuthService,
  ){};

  async loadProducts(memberId: string): Promise<ProductEntiy[]>{
    const member:MemberEntity = await this.authService.findById(memberId)
    this.nullCheckForEntity(member);

    const productList: ProductEntiy[] = await this.productRepository.findBy({member})
    for(const product of productList){
      this.nullCheckForEntity(product);
    };

    return productList;
  }
  
  @Transactional()
  async addProduct(addProductDto: AddProductDto , memberId: string): Promise<void>{
    const member:MemberEntity = await this.authService.findById(memberId)
    this.nullCheckForEntity(member);

    const productAndUrl = DtoToEntityMapper.addProductDtoToNewProductAndUrlEntityMapper(
      addProductDto, member
    );
    console.log('------------------------')
    const example = new FormData();
    console.log(example);

    const productEntity:ProductEntiy = productAndUrl.product;
    const urlEntity:UrlEntity = productAndUrl.url;
    this.nullCheckForEntity(productEntity);
    this.nullCheckForEntity(urlEntity);
    await this.productRepository.save(productEntity);
    await this.urlRepository.save(urlEntity);
  };

  @Transactional()
  async deleteProduct(productId: string): Promise<void>{
    try{
      const productEntity:ProductEntiy = await this.productRepository.findOneBy({id: productId});
      this.nullCheckForEntity(productEntity);

      const urlEntities:UrlEntity[] = await this.urlRepository.findBy({product: productEntity});
      if (urlEntities.length ==0) throw new NotFoundException()

      for(const urlEntity of urlEntities){
        await this.urlRepository.remove(urlEntity);
      };

      await this.productRepository.remove(productEntity);
    } catch(error){
      if(error instanceof QueryFailedError){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 제품을 삭제하는 중 오류가 발생했습니다. id 형식이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 제품을 삭제하는 중 오류가 발생했습니다. 해당 제품 및 url을 찾지 못했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 제품을 삭제하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  };

  @Transactional()
  async updateProduct(productId: string, updateProductDto: UpdateProductDto): Promise<void>{
    const productEntity = await this.productRepository.findOneBy({id: productId});
    this.nullCheckForEntity(productEntity);
    productEntity.productName = updateProductDto.productName;
    productEntity.productImage = updateProductDto.productImage;
    productEntity.description = updateProductDto.productDescription;
    await this.productRepository.save(productEntity);
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  };
};