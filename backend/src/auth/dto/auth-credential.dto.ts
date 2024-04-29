import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  password: string;
}