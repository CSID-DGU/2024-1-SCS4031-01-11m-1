import { MemberEntity } from 'src/auth/member.entity';
import { BaseEntity } from 'src/base-entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ReportSource } from '../domain/report-source';

@Entity()
export class ReportEntiy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', {nullable: true})
  reportSources: ReportSource[];

  @Column()
  productName: string;

  @ManyToOne(() => MemberEntity, {eager: false})
  member: MemberEntity;

  constructor(
    reportSources: ReportSource[],
    productName: string,
    member: MemberEntity
  ){
    super()
    this.reportSources = reportSources;
    this.productName = productName;
    this.member = member;
  };

  static createNew(reportSources: ReportSource[], member:MemberEntity, productName: string){
    return new ReportEntiy(reportSources, productName, member);
  };
};