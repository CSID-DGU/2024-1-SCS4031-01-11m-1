import { MemberEntity } from 'src/auth/member.entity';
import { BaseEntity } from 'src/base-entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CategoryAnalysisSourceDto } from '../dto/category-analysis-source.dto';

@Entity()
export class ReportEntiy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  categoryAnalysisSource: CategoryAnalysisSourceDto[];

  @ManyToOne(() => MemberEntity, {eager: false})
  member: MemberEntity;
};