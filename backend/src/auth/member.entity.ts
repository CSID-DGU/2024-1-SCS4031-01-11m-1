import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';

@Entity()
export class MemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  memberId: string;

  @Column()
  name: string;

  @Column()
  password: string;
}