import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class AddCategoryDto{
  @ApiProperty({
    example: "카테고리 이름",
    description: "발림성"
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  categoryName: string;
}