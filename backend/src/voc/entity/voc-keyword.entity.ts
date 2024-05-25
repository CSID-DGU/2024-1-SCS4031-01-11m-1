import { BaseEntity } from "src/base-entity";
import { CategoryEntity } from "src/member-data/category/entity/category.entity";
import { ProductEntity } from "src/member-data/products/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm"

@Entity()
export class VocKeywordEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(() => ProductEntity)
    product:ProductEntity;

    @ManyToOne(() => CategoryEntity)
    category:CategoryEntity;

    @Column("text", {array:true})
    keywords: string[];

    constructor(
        product:ProductEntity,
        category:CategoryEntity,
        keywords:string[]
    ){
        super();
        this.product = product;
        this.category = category;
        this.keywords = keywords;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public static create(product:ProductEntity, category:CategoryEntity, keywords:string[]):VocKeywordEntity{
        return new VocKeywordEntity(product, category, keywords);
    }

    public updateKeywords(keywords:string[]): string{
        

        return "sueecess";
    }

}