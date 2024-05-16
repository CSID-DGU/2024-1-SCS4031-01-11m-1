import { MemberEntity } from 'src/auth/member.entity';
import { BaseEntity } from 'src/base-entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProductMinuteEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  minuteName: string;

  @Column()
  minuteUrl: string;

  @ManyToOne(() => MemberEntity, {eager: false})
  member: MemberEntity;

  constructor(
    minuteName: string,
    minuteUrl: string,
    member: MemberEntity,
  ){
    super();
    this.minuteName = minuteName;
    this.minuteUrl = minuteUrl;
    this.member = member;
  };

  static createNew(
    minuteName: string,
    minuteUrl: string,
    member: MemberEntity
  ){
    return new ProductMinuteEntity(
      minuteName,
      minuteUrl,
      member
    )};
}