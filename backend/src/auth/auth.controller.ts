import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Member } from './get-member-decorator';

@ApiTags('Auth Controller')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @ApiOperation({ summary: '회원가입을 합니다.' })
  @Post('/sign-up')
  async signUp(@Body() authCredentialDto: AuthCredentialsDto): Promise<string>{
    return await this.authService.signUp(authCredentialDto);
  };

  @ApiOperation({ summary: '로그인을 합니다.' })
  @Post('sign-in')
  async signIn(@Body(ValidationPipe)authLoginDto: AuthLoginDto): Promise<{accessToken:string}>{
    return await this.authService.signIn(authLoginDto);
  };

  @Post('/authTest')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  authTest(@Req() req){
    console.log(req.user.memberId)
  };
}
