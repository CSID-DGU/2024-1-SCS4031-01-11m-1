
import { VocController } from "./controller/voc.controller";
import { MemberEntity } from "src/auth/member.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ProductEntity } from "src/member-data/products/entities/product.entity";
import { UrlEntity } from "src/member-data/products/entities/url.entity";
import { VocService } from "./service/voc.service";
import { DataScrapingModuleMapping } from "./data-scraper/data-scraper-mapping";
import { VocEntity } from "./entity/voc.entity";
import { VocAnalysisEntity } from "./entity/voc-analysis.entity";
import { CategoryEntity } from "src/member-data/category/entity/category.entity";
import { CustomOpenAI } from "src/llm/llm-module";
import { VocKeywordEntity } from "./entity/voc-keyword.entity";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VocEntity,
            UrlEntity,
            ProductEntity,
            VocAnalysisEntity,
            VocKeywordEntity,
            CategoryEntity,
            MemberEntity
        ]),
        AuthModule,
      ],
    controllers: [VocController],
    providers: [VocService, DataScrapingModuleMapping, CustomOpenAI, AuthService,
        JwtService,]
})
export class VocModule{}