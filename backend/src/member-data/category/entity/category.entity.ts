import { MemberEntity } from 'src/auth/member.entity';
import { BaseEntity } from 'src/base-entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({nullable: true})
  categoryName: string;

  @ManyToOne(() => MemberEntity, {eager: false})
  member: MemberEntity;

  constructor(
    categoryName: string,
    member: MemberEntity,
  ){
    super()
    this.categoryName = categoryName;
    this.member = member;
  };

  static createNew(categoryName: string, member: MemberEntity): CategoryEntity{
    const category = new CategoryEntity(categoryName, member);
    return category;
  };
}