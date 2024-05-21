import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class AddProductMinuteDto {
  @ApiProperty({
    example: "11m suncream 회의록",
    description: "회의록 이름"
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  productMinuteName: string;
}