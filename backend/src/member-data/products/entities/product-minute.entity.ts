import { MemberEntity } from 'src/auth/member.entity';
import { BaseEntity } from 'src/base-entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProductMinuteEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  minuteName: string;

  @Column({nullable: true})
  minute: string;

  @Column({nullable: true})
  path: string;

  @ManyToOne(() => MemberEntity, {eager: false})
  member: MemberEntity;

  constructor(
    minuteName: string,
    minute: string,
    path: string,
    member: MemberEntity,
  ){
    super();
    this.minuteName = minuteName;
    this.minute = minute;
    this.path = path;
    this.member = member;
  };

  static createNew(
    minuteName: string,
    minute: string,
    path: string,
    member: MemberEntity
  ){
    return new ProductMinuteEntity(
      minuteName,
      minute,
      path,
      member
    )};
}