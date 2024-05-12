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

  constructor(
    url: string,
    product: ProductEntiy
  ){
    super();
    this.url = url;
    this.product = product;
  };

  static createNew(
    url: string,
    product: ProductEntiy
  ){
    return new UrlEntity(
      url,
      product,
    );
  };
}