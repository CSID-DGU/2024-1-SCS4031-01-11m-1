import { MemberEntity } from 'src/auth/member.entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';

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
  ){
    super();
    this.productName = productName;
    this.productImage = productImage;
    this.description = description;
    this.member = member;
  }

  static createNew(
    productName: string,
    productImage: string,
    description: string,
    member: MemberEntity,
  ){
    return new ProductEntiy(
      productName,
      productImage,
      description,
      member
    );
  };
}