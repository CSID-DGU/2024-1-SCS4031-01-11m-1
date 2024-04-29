import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('/sign-up')
  signUp(@Body() authCredentialDto: AuthCredentialsDto): Promise<void>{
    return this.authService.signUp(authCredentialDto);
  }

  @Post('sign-in')
  signIn(@Body(ValidationPipe)authCredentialsDto: AuthCredentialsDto): Promise<{accessToken:string}>{
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/authTest')
  @UseGuards(AuthGuard())
  authTest(@Req() req){
    console.log(req)
  }
}
