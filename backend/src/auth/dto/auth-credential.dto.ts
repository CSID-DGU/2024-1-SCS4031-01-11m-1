import { IsString, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(3)
  @MinLength(20)
  memberId: string;

  @IsString()
  @MinLength(3)
  @MinLength(20)
  name: string;

  @IsString()
  @MinLength(3)
  @MinLength(20)
  password: string;
}