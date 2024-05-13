import { MemberEntity } from 'src/auth/member.entity';
import { BaseEntity } from 'src/base-entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProductMinuteEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  minuteName: string;

  @ManyToOne(() => MemberEntity, {eager: false})
  member: MemberEntity;

  constructor(
    minuteName: string,
    member: MemberEntity,
  ){
    super();
    this.minuteName = minuteName;
    this.member = member
  };

  static createNew(
    minuteName: string,
    member: MemberEntity
  ){
    return new ProductMinuteEntity(
      minuteName,
      member
    )};
}