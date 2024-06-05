import { CategoryEntity } from "src/member-data/category/entity/category.entity";
import { VocCountPerWeekDto } from "./voc-count-per-week.dto";

export class VocCountPerCategoryDto{
    category:CategoryEntity;
    vocCountList:VocCountPerWeekDto[];

    constructor(
        category:CategoryEntity,
    ){
        this.category = category;
        this.vocCountList = [];
    }

    public static create(category:CategoryEntity, vocCountList:VocCountPerWeekDto[]):VocCountPerCategoryDto{
        return new VocCountPerCategoryDto(category);
    }
}