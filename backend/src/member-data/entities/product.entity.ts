import { MemberEntity } from 'src/auth/member.entity';
import { ManyToOne, Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';

@Entity()
export class ProductEntiy extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productName: string;

    @Column()
    description: string

    @ManyToOne(() => MemberEntity, {eager: false})
    member: MemberEntity;
}