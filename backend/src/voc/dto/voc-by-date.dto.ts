import { VocEntity } from "../entity/voc.entity";

export class VocByDateDto{
    date:Date;
    vocs:VocEntity[];

    constructor(date:Date, vocs:VocEntity[]){
        this.date = date;
        this.vocs = vocs;
    }
}