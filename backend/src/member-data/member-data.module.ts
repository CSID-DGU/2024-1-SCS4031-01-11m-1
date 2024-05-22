import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/auth/member.entity';
import { ProductEntity } from './products/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UrlEntity } from './products/entities/url.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ProductMinuteEntity } from './products/entities/product-minute.entity';
import { CategoryEntity } from './category/entity/category.entity';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      ProductEntity,
      UrlEntity,
      ProductMinuteEntity,
      CategoryEntity,
    ]),
    AuthModule
  ],
  controllers: [ProductsController, CategoryController],
  providers: [
    ProductsService,
    AuthService,
    JwtService,
    CategoryService,
  ],
})
export class MemberDataModule {}
