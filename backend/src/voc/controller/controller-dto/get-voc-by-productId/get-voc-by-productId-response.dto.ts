import { VocDto } from "../../../dto/voc.dto";
import { UrlVocListDto } from "./url-voc-list.dto";

export class GetVocByProductIdResponseDto{
    vocList:UrlVocListDto[];
    
    constructor(vocList:UrlVocListDto[]){
        this.vocList = vocList;
    }
}