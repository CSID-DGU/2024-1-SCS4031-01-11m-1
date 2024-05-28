import { VocCountPerCategoryDto } from "./voc-count-per-category.dto";

export class VocCountPerDateDto{
    date:Date;
    vocList:VocCountPerCategoryDto[];
    totalVocCount:number;

    constructor(
        date:Date,
        vocList:VocCountPerCategoryDto[]
    ){
        this.date = date;
        this.vocList = vocList;
        this.totalVocCount = 0;
        for(let i = 0; i <vocList.length; i++){
            this.totalVocCount = this.totalVocCount + vocList[i].totalVocCount;
        }
    }
}