import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ProductEntity } from './product.entity';
import { BaseEntity } from 'src/base-entity';
import { LazyModuleLoader } from '@nestjs/core';

@Entity()
export class UrlEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(()=>ProductEntity, {eager:false})
  product: ProductEntity;

  constructor(
    url: string,
    product: ProductEntity,
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
    product: ProductEntity,
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