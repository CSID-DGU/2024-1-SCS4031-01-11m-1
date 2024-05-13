
import { VocController } from "./controller/VocContoller";
import { MemberEntity } from "src/auth/member.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ProductEntiy } from "src/member-data/products/entities/product.entity";
import { UrlEntity } from "src/member-data/products/entities/url.entity";
import { VocService } from "./service/VocService";
import { DataScrapingModuleMapping } from "./data_scraping_module/DataScrapingModuleMapping";

@Module({
    controllers: [VocController],
    providers: [VocService, DataScrapingModuleMapping]
})
export class VocModule{}