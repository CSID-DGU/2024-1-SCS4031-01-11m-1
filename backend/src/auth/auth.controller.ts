import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('/sign-up')
  signUp(@Body() authCredentialDto: AuthCredentialsDto): Promise<void>{
    return this.authService.signUp(authCredentialDto);
  }

  @Post('sign-in')
  signIn(@Body(ValidationPipe)authLoginDto: AuthLoginDto): Promise<{accessToken:string}>{
    return this.authService.signIn(authLoginDto);
  }

  @Post('/authTest')
  @UseGuards(AuthGuard())
  authTest(@Req() req){
    console.log(req)
  }
}
