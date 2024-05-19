import { BaseEntity } from 'src/base-entity';
import { UrlEntity } from 'src/member-data/products/entities/url.entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, JoinColumn } from 'typeorm';

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

    @ManyToOne(() => UrlEntity)
    @JoinColumn({name: "url_id"})
    url: UrlEntity;

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