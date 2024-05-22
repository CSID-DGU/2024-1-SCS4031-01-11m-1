import { VocDto } from "../../../dto/voc.dto";

export class UrlVocListDto{
    url: string;
    vocs: VocDto[];

    constructor(url:string){
        this.url = url;
        this.vocs = [];
    }
}