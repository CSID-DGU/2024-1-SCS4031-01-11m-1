import { CategoryEntity } from "src/member-data/category/entity/category.entity";

export class VocCountPerCategoryDto{
    category:CategoryEntity;
    totalVocCount:number;
    positiveVocCount:number;
    negativeVocCount:number;

    constructor(
        category:CategoryEntity,
        positiveVocCount:number,
        negativeVocCount:number
    ){
        this.category = category;
        this.totalVocCount = positiveVocCount + negativeVocCount;
        this.positiveVocCount = positiveVocCount;
        this.negativeVocCount = negativeVocCount;
    }
}