import{ VocEntity } from "../entity/voc.entity";

export class VocDto{
    id:string;

    score:number;

    description:string;

    uploadedDate:Date;

    constructor(
        id:string,
        score:number,
        description:string,
        uploadedDate:Date,
    ){
        this.id = id;
        this.score = score;
        this.description = description;
        this.uploadedDate = uploadedDate;
    };

    public static create(vocEntity:VocEntity):VocDto{
        return new VocDto(vocEntity.id, vocEntity.score, vocEntity.description, vocEntity.uploadedDate)
    }

}