import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entity/category.entity";
import { Repository, QueryFailedError } from 'typeorm';
import { Transactional } from "typeorm-transactional";
import { MemberEntity } from "src/auth/member.entity";
import { AuthService } from "src/auth/auth.service";
import { VocAnalysisEntity } from "src/voc/entity/voc-analysis.entity";
import { VocKeywordEntity } from "src/voc/entity/voc-keyword.entity";
import { ProductsService } from "../products/products.service";

@Injectable()
export class CategoryService{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly authService: AuthService,
    @InjectRepository(VocAnalysisEntity)
    private readonly vocAnalysisRepository: Repository<VocAnalysisEntity>,
    @InjectRepository(VocKeywordEntity)
    private readonly vocKeywordRepository: Repository<VocKeywordEntity>
  ){}

  async loadCategories(memberId: string): Promise<CategoryEntity[]>{
    try{
      const member:MemberEntity = await this.authService.findById(memberId)
      this.nullCheckForEntity(member); 

      const categories: CategoryEntity[] = await this.categoryRepository.findBy({member});
      return categories;
    } catch(error){
        if(error instanceof NotFoundException){
          throw new NotFoundException({
            HttpStatus: HttpStatus.NOT_FOUND,
            error: '[ERROR] 카테고리 리스트를 불러오는 중 오류가 발생했습니다.',
            message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
            cause: error,
        });
        } else {
          throw new InternalServerErrorException({
            HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
            error: '[ERROR] 카테고리 리스트를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
            message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
            cause: error,
        });
      }
    }
  }

  @Transactional()
  async addCategory(categoryName:string, memberId:string):Promise<void>{
    try{
      const member:MemberEntity = await this.authService.findById(memberId)
      this.nullCheckForEntity(member);

      const checkDuplication = await this.categoryDuplicationCheck(categoryName);

      if(checkDuplication == true){
        throw new BadRequestException()
      } else{
        const category = CategoryEntity.createNew(categoryName, member);
        await this.categoryRepository.save(category);
      };
    } catch(error){
        if(error instanceof QueryFailedError){
          throw new BadRequestException({
            HttpStatus: HttpStatus.BAD_REQUEST,
            error: '[ERROR] 카테고리를 추가하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
            message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
            cause: error,
          });
        } else if(error instanceof BadRequestException){
          throw new BadRequestException({
            HttpStatus: HttpStatus.BAD_REQUEST,
            error: '[ERROR] 카테고리를 추가하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
            message: '이미 존재하는 카테고리입니다.',
            cause: error,
          });
        } else if(error instanceof NotFoundException){
          throw new NotFoundException({
            HttpStatus: HttpStatus.NOT_FOUND,
            error: '[ERROR] 카테고리를 추가하는 중 오류가 발생했습니다.',
            message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
            cause: error,
          });
        } else {
          throw new InternalServerErrorException({
            HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
            error: '[ERROR] 카테고리를 추가하는 중에 예상치 못한 문제가 발생했습니다.',
            message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
            cause: error,
          });
        }
      }
  }

  @Transactional()
  async deleteCategory(categoryId:string):Promise<void>{
    try{
      const category: CategoryEntity = await this.categoryRepository.findOneBy({id: categoryId});
      this.nullCheckForEntity(category);
      
      await this.vocKeywordRepository.delete({category: category});
      await this.vocAnalysisRepository.delete({category: category});
      await this.categoryRepository.remove(category);
    } catch(error){
      if(error instanceof QueryFailedError){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 카테고리를 삭제하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof BadRequestException){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 카테고리를 삭제하는 중 오류가 발생했습니다. 요청값이 올바른지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else if(error instanceof NotFoundException){
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] 카테고리를 삭제하는 중 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 카테고리를 삭제하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      };
    }
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  };

  private async categoryDuplicationCheck(name: string){
    const category = await this.categoryRepository.findOneBy({categoryName: name});
    if(category){
      return true;
    } else{
      return false;
    }
  };
}