import { Injectable } from '@nestjs/common';
import { ProductEntiy } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UrlEntity } from './entities/url.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberDataService {
  constructor(
    @InjectRepository(ProductEntiy)
    private readonly productRepository: Repository<ProductEntiy>,
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ){}
  
  async addProduct(){
    
  }
}
