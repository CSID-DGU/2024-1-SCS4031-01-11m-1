import { CategoryEntity } from "src/member-data/category/entity/category.entity";
import { VocCountPerWeekDto } from "./voc-count-per-week.dto";

export class VocCountPerCategoryDto{
    categoryName:string;
    categoryId:string;
    vocCountList:VocCountPerWeekDto[];

    constructor(
        categoryName:string,
        categoryId:string
    ){
        this.categoryName = categoryName;
        this.categoryId = categoryId;
        this.vocCountList = [];
    }

    public static create(categoryName:string, categoryId:string):VocCountPerCategoryDto{
        return new VocCountPerCategoryDto(categoryName, categoryId);
    }
}