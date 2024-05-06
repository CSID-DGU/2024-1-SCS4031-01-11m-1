import { IsString, MinLength, MaxLength } from 'class-validator';

export class AddProductDto {
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

  @IsString()
  productUrl: string;
}