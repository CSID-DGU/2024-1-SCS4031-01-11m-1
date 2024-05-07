import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({
    example: "사용자id",
    description: "사용자가 로그인에 사용할 id"
  })
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({
    example: "사용자Password",
    description: "사용자가 로그인에 사용할 password"
  })
  password: string;
}