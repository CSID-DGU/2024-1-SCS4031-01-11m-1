import { MemberEntity } from "src/auth/member.entity";
import { AddProductDto } from "../dtos/add-product.dto";
import { ProductEntiy } from "../entities/product.entity";
import { UrlEntity } from "../entities/url.entity";

export class DtoToEntityMapper{
  static addProductDtoToNewProductAndUrlEntityMapper(addProductDto: AddProductDto, member: MemberEntity){
    const { productName, productImage, productDescription, productUrl } = addProductDto;
    const productEntity = ProductEntiy.createNew(productName, productImage, productDescription, member)
    const urlEntity = UrlEntity.createNew(productUrl, productEntity)

    const result = {
      product: productEntity,
      url: urlEntity
    };

    return result;
  }
}