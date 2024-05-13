import { MemberEntity } from 'src/auth/member.entity';
import { BaseEntity } from 'src/base-entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProductEntiy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column()
  productImage: string;

  @Column()
  description: string

  @ManyToOne(() => MemberEntity, {eager: false})
  member: MemberEntity;

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
    return new ProductEntiy(
      productName,
      productImage,
      description,
      member,
      createdAt,
      updatedAt
    );
  };
}