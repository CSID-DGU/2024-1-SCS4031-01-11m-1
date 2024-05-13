import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/auth/member.entity';
import { ProductEntiy } from './products/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UrlEntity } from './products/entities/url.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      ProductEntiy,
      UrlEntity,
    ]),
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    AuthService,
    JwtService
  ],
})
export class MemberDataModule {}
