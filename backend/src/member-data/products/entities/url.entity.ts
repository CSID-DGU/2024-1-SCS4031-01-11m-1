import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ProductEntiy } from './product.entity';
import { BaseEntity } from 'src/base-entity';
import { LazyModuleLoader } from '@nestjs/core';

@Entity()
export class UrlEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(()=>ProductEntiy, {eager: false})
  product: ProductEntiy;

  constructor(
    url: string,
    product: ProductEntiy,
    createdAt: Date,
    updatedAt: Date,
  ){
    super();
    this.url = url;
    this.product = product;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  };

  static createNew(
    url: string,
    product: ProductEntiy,
    createdAt: Date,
    updatedAt: Date,
  ){
    return new UrlEntity(
      url,
      product,
      createdAt,
      updatedAt,
    );
  };
}