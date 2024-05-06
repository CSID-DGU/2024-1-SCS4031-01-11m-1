import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntiy } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UrlEntity } from './entities/url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductDto } from './dtos/add-product.dto';
import { AuthService } from 'src/auth/auth.service';

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

    const productEntity: ProductEntiy = await this.productRepository.findOneBy({member: member})
    this.nullCheckForEntity(productEntity);
    productEntity.productName = productName;
    productEntity.productImage = productImage;
    productEntity.description = productDescription;
    await this.productRepository.save(productEntity);

    const urlEntity: UrlEntity = await this.urlRepository.findOneBy({product: productEntity})
    this.nullCheckForEntity(urlEntity);
    urlEntity.url = productUrl;
    await this.urlRepository.save(urlEntity);
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }
}