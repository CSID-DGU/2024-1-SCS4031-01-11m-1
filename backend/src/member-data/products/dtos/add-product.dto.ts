import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class AddProductDto {
  @ApiProperty({
    example: "11m suncream",
    description: "상품 이름"
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  productName: string;

  @ApiProperty({
    example: "11m suncream은 매우 촉촉합니다 !",
    description: "상품 설명"
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  productDescription: string;

  @ApiProperty({
    example: "oliveyoung/11msuncream.com",
    description: "상품 url"
  })
  @IsString()
  productUrl: string;
}