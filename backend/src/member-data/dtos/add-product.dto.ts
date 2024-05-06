import { IsString, MinLength, MaxLength } from 'class-validator';

export class AddProduct {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  productName: string;

  @IsString()
  productImage: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  productDescription: string;
}