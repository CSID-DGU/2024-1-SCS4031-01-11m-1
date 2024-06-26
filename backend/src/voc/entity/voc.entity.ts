import { BaseEntity } from 'src/base-entity';
import { UrlEntity } from 'src/member-data/products/entities/url.entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { VocAnalysisEntity } from './voc-analysis.entity';

@Entity()
export class VocEntity extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    score:number;

    @Column()
    description:string

    @Column()
    uploadedDate:Date

    @ManyToOne(() => UrlEntity, {eager:true})
    @JoinColumn({name: "url_id"})
    url: UrlEntity;

    @OneToOne(() => VocAnalysisEntity, vocAnalysisEntity => vocAnalysisEntity.voc, {eager:true})
    vocAnalysis:VocAnalysisEntity;

    constructor(
        score: number,
        description: string,
        url: UrlEntity,
        uploadedDate:Date,
        createdAt: Date,
        updatedAt: Date,
      ){
        super();
        this.score = score;
        this.description = description;
        this.url = url;
        this.uploadedDate = uploadedDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
      }

    public static create(description: string, score: number, url: UrlEntity, uploadedDate:Date){
        return new VocEntity(score, description, url, uploadedDate, new Date(), new Date());
    } 
}