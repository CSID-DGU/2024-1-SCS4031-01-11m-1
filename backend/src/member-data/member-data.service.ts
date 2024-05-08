import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntiy } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UrlEntity } from './entities/url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductDto } from './dtos/add-product.dto';
import { AuthService } from 'src/auth/auth.service';
import { DtoToEntityMapper } from './mapper/dto-to-entity.mapper';
import { Transactional } from 'typeorm-transactional';
import { UpdateProductDto } from './dtos/update-product.dto';
import { MemberEntity } from 'src/auth/member.entity';

@Injectable()
export class MemberDataService {
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

    const productAndUrl = DtoToEntityMapper.addProductDtoToNewProductAndNewUrlEntityMapper(
      addProductDto, member
    );

    const productEntity:ProductEntiy = productAndUrl.product;
    const urlEntity:UrlEntity = productAndUrl.url;
    this.nullCheckForEntity(productEntity);
    this.nullCheckForEntity(urlEntity);
    await this.productRepository.save(productEntity);
    await this.urlRepository.save(urlEntity);
  };

  @Transactional()
  async deleteProduct(productId: string): Promise<void>{
    const productEntity:ProductEntiy = await this.productRepository.findOneBy({id: productId});
    this.nullCheckForEntity(productEntity);
    if(productEntity){
      const urlEntities:UrlEntity[] = await this.urlRepository.findBy({product: productEntity});
      for(const urlEntity of urlEntities){
        this.nullCheckForEntity(urlEntity);
        await this.urlRepository.remove(urlEntity);
      };
    };
    await this.productRepository.remove(productEntity);
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