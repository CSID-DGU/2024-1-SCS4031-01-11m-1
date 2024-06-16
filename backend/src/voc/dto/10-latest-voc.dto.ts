import { VocEntity } from "src/voc/entity/voc.entity";
import { TenLatestIndividualDto } from "./10-latest-individual-voc.dto";

export class TenLatestVocDto{
    categoryName:string;
    categoryId:string;
    vocList:TenLatestIndividualDto[];
    
    constructor(
        categoryName:string,
        categoryId:string,
        vocList:TenLatestIndividualDto[]
    ){
        this.categoryName = categoryName;
        this.categoryId = categoryId;
        this.vocList = vocList;
    }
    
}