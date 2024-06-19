import { MemberEntity } from 'src/auth/member.entity';
import { BaseEntity } from 'src/base-entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { UrlEntity } from './url.entity';

@Entity()
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column()
  productImage: string;

  @Column()
  description: string;

  @ManyToOne(() => MemberEntity, {eager: true})
  member: MemberEntity;

  @OneToMany(() => UrlEntity, urlEntity => urlEntity.product, {eager:true})
  urls:UrlEntity[];

  constructor(
    productName: string,
    productImage: string,
    description: string,
    member: MemberEntity,
    createdAt: Date,
    updatedAt: Date,
  ){
    super();
    this.productName = productName;
    this.productImage = productImage;
    this.description = description;
    this.member = member;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static createNew(
    productName: string,
    productImage: string,
    description: string,
    member: MemberEntity,
    createdAt: Date,
    updatedAt: Date
  ){
    return new ProductEntity(
      productName,
      productImage,
      description,
      member,
      createdAt,
      updatedAt
    );
  };
}