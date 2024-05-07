import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntiy } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UrlEntity } from './entities/url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductDto } from './dtos/add-product.dto';
import { AuthService } from 'src/auth/auth.service';
import { DtoToEntityMapper } from './mapper/dto-to-entity.mapper';

@Injectable()
export class MemberDataService {
  constructor(
    @InjectRepository(ProductEntiy)
    private readonly productRepository: Repository<ProductEntiy>,
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
    private readonly authService: AuthService,
  ){}
  
  async addProduct(addProductDto: AddProductDto , memberId: string): Promise<void>{
    const { productName, productImage, productDescription, productUrl } = addProductDto;
    const member = await this.authService.findById(memberId)
    this.nullCheckForEntity(member);

    const productAndUrl = DtoToEntityMapper.addProductDtoToNewProductAndNewUrlEntityMapper(
      addProductDto, member
    );

    const productEntity = productAndUrl.product;
    const urlEntity = productAndUrl.url;
    this.nullCheckForEntity(productEntity);
    this.nullCheckForEntity(urlEntity);
    await this.productRepository.save(productEntity);
    await this.urlRepository.save(urlEntity);
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }
}