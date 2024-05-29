import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsUUID } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    example: "productId123129e83u2o1381312i1",
    description: "상품 id (uuid)"
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: "productId123129e83u2o1381312i1",
    description: "회의록 id (uuid)"
  })
  @IsUUID()
  minuteId: string;
}