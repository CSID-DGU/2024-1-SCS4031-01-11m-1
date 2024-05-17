import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductEntiy } from './entities/product.entity';
import { Repository, QueryFailedError } from 'typeorm';
import { UrlEntity } from './entities/url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductDto } from './dtos/add-product.dto';
import { AuthService } from 'src/auth/auth.service';
import { ProductMapper } from './mapper/products.mapper';
import { Transactional } from 'typeorm-transactional';
import { UpdateProductDto } from './dtos/update-product.dto';
import { MemberEntity } from 'src/auth/member.entity';
import { ProductMinuteEntity } from './entities/product-minute.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntiy)
    private readonly productRepository: Repository<ProductEntiy>,
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
    @InjectRepository(ProductMinuteEntity)
    private readonly productMinuteRepository: Repository<ProductMinuteEntity>,
    private readonly authService: AuthService,
  ){};

  async loadProducts(memberId: string): Promise<ProductEntiy[]>{
    try{
      const member:MemberEntity = await this.authService.findById(memberId)
      this.nullCheckForEntity(member);

      const products: ProductEntiy[] = await this.productRepository.findBy({member})

      return products;
    } catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 제품 리스트를 불러오는 중 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 제품 리스트를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  @Transactional()
  async loadProductUrls(productId: string): Promise<UrlEntity[]>{
    try{
      const productEntity = await this.productRepository.findOneBy({id: productId});
      this.nullCheckForEntity(productEntity);

      const urls = await this.urlRepository.findBy({product: productEntity});
      return urls;
    } catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] url 리스트를 불러오는 중 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] url 리스트를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }
  
  @Transactional()
  async addProduct(addProductDto: AddProductDto , memberId: string, file: Express.Multer.File): Promise<void>{
    try{
      const member:MemberEntity = await this.authService.findById(memberId)
      this.nullCheckForEntity(member);
      const fileName = `${file.filename}`;
      const fileUrl = `/media/${fileName}`;

      const productAndUrl = ProductMapper.createNewProductAndUrlEntity(addProductDto, member, fileUrl)

      const productEntity = productAndUrl.product
      const urlEntity = productAndUrl.url
      this.nullCheckForEntity(productEntity);
      this.nullCheckForEntity(urlEntity);

      await this.productRepository.save(productEntity);
      await this.urlRepository.save(urlEntity);
    } catch(error){
      if(error instanceof QueryFailedError){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 제품을 추가하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof BadRequestException){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 제품을 추가하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 제품을 추가하는 중 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 제품을 추가하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
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
          error: '[ERROR] 제품을 삭제하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof BadRequestException){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 제품을 삭제하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 제품을 삭제하는 중 오류가 발생했습니다.',
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
  async updateProduct(productId: string, updateProductDto: UpdateProductDto, file: Express.Multer.File): Promise<void>{
    try{
      const productEntity = await this.productRepository.findOneBy({id: productId});
      this.nullCheckForEntity(productEntity);
      const fileName = `${file.filename}`;
      const fileUrl = `/media/${fileName}`;
      productEntity.productName = updateProductDto.productName;
      productEntity.productImage = fileUrl;
      productEntity.description = updateProductDto.productDescription;
      await this.productRepository.save(productEntity);
    } catch(error){
      if(error instanceof QueryFailedError){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 제품을 업데이트하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof BadRequestException){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 제품을 업데이트하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 제품을 업데이트하는 중 오류가 발생했습니다. 해당 제품을 찾을 수 없습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 제품을 업데이트하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  @Transactional()
  async addProductMinute(productMinuteName: string, memberId: string, file: Express.Multer.File): Promise<void>{
    try{
      const member:MemberEntity = await this.authService.findById(memberId)
      this.nullCheckForEntity(member);

      const fileName = `${file.filename}`;
      const fileUrl = `/media/${fileName}`;

      const producMinuteEntity = ProductMinuteEntity.createNew(productMinuteName, fileUrl, member);
      await this.productMinuteRepository.save(producMinuteEntity);
    } catch(error){
      if(error instanceof QueryFailedError){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 상품 회의록을 추가하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof BadRequestException){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 상품 회의록을 추가하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 상품 회의록을 추가하는 중 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 상품 회의록을 추가하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  };

  @Transactional()
  async deleteProductMinute(productMinuteId: string):Promise<void>{
    try{
      const minuteEntity = await this.productMinuteRepository.findOneBy({id: productMinuteId});
      this.nullCheckForEntity(minuteEntity);
      await this.productMinuteRepository.remove(minuteEntity);
    }catch(error){
      if(error instanceof QueryFailedError){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 회의록을 삭제하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof BadRequestException){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 회의록을 삭제하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 회의록을 삭제하는 중 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 회의록을 삭제하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      };
    };
  }

  async loadProductMintes(memberId:string):Promise<ProductMinuteEntity[]>{
    try{
      const member:MemberEntity = await this.authService.findById(memberId)
      this.nullCheckForEntity(member);

      const productMinutes = await this.productMinuteRepository.findBy({member});
      if(productMinutes.length == 0){
        throw new NotFoundException();
      };

      return productMinutes;
    } catch(error){
      if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 회의록 리스트를 불러오는 중 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 회의록 리스트를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  };

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  };
};