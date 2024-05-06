import { ManyToOne, Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';
import { ProductEntiy } from './product.entity';

@Entity()
export class UrlEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(()=>ProductEntiy)
  product: ProductEntiy;
}