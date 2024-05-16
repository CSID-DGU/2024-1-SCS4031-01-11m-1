import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
  example: "11m suncream",
  description: "업데이트 할 상품 이름"
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  productName: string;

  @ApiProperty({
  example: "11m suncream은 매우 매우 촉촉합니다.",
  description: "업데이트 할 상품 설명"
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  productDescription: string;
}