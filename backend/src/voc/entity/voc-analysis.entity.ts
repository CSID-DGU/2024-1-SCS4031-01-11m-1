import { BaseEntity } from "src/base-entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne } from "typeorm"
import { VocEntity } from "./voc.entity";
import { CategoryEntity } from "src/member-data/category/entity/category.entity";
import { SentimentEnum } from "./sentiment.enum";

@Entity()
export class VocAnalysisEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(() => VocEntity)
    voc:VocEntity

    @ManyToOne(() => CategoryEntity, {eager:true})
    category:CategoryEntity;

    @Column({
        type:"enum",
        enum:SentimentEnum
    })
    primarySentiment:SentimentEnum;

    @Column("simple-json")
    sentiment:{category:string, sentiment:string}

    constructor(
        voc:VocEntity,
        category:CategoryEntity,
        primarySentiment:SentimentEnum,
        sentiment:{category:string, sentiment:string},
        createdAt:Date,
        updatedAt:Date
    ){
        super();
        this.voc = voc;
        this.category = category,
        this.primarySentiment = primarySentiment;
        this.sentiment = sentiment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static create(voc:VocEntity, category:CategoryEntity, primarySentiment:SentimentEnum, sentiment:{category:string, sentiment:string}):VocAnalysisEntity{
        return new VocAnalysisEntity(voc,category, primarySentiment,sentiment, new Date(), new Date());
    }

}