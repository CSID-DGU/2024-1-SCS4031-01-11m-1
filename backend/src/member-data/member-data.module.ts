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
import { ReportController } from './report/controller/report.controller';
import { ReportService } from './report/service/report.service';
import { VocService } from 'src/voc/service/voc.service';
import { CustomOpenAI } from 'src/llm/llm-module';
import { VocModule } from 'src/voc/voc.module';
import { VocEntity } from 'src/voc/entity/voc.entity';
import { VocAnalysisEntity } from 'src/voc/entity/voc-analysis.entity';
import { VocKeywordEntity } from 'src/voc/entity/voc-keyword.entity';
import { ReportEntity } from './report/entity/report.entity';
import { DataScrapingModuleMapping } from 'src/voc/data-scraper/data-scraper-mapping';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      ProductEntity,
      UrlEntity,
      ProductMinuteEntity,
      CategoryEntity,
      ReportEntity,
      VocEntity,
      VocAnalysisEntity,
      VocKeywordEntity,
    ]),
    AuthModule,
    VocModule
  ],
  controllers: [ProductsController, CategoryController, ReportController],
  providers: [
    ProductsService,
    AuthService,
    JwtService,
    CategoryService,
    ReportService,
    VocService,
    CustomOpenAI,
    DataScrapingModuleMapping,
  ],
})
export class MemberDataModule {}
