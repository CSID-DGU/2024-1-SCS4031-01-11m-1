import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('/sign-up')
  signUp(@Body() authCredentialDto: AuthCredentialsDto): Promise<void>{
    return this.authService.signUp(authCredentialDto);
  }
}
