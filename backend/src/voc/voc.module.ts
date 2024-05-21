
import { VocController } from "./controller/voc.controller";
import { MemberEntity } from "src/auth/member.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ProductEntiy } from "src/member-data/products/entities/product.entity";
import { UrlEntity } from "src/member-data/products/entities/url.entity";
import { VocService } from "./service/voc.service";
import { DataScrapingModuleMapping } from "./data-scraper/data-scraper-mapping";
import { VocEntity } from "./entity/voc.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VocEntity,
            UrlEntity,
            ProductEntiy
        ])
      ],
    controllers: [VocController],
    providers: [VocService, DataScrapingModuleMapping]
})
export class VocModule{}