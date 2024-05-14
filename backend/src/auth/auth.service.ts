import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { MemberEntity } from './member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
    private jwtService: JwtService
  ){}
  
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string>{
    try{
      const {name, password, username} = authCredentialsDto;
      const checkMember =  await this.memberCheck(name)
      if(checkMember == true){
        return "이미 존재하는 Id입니다."
      }else{
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);
        const memberEntity = this.memberRepository.create({name: name, username: username ,password: hashedPassword});
        await this.memberRepository.save(
          memberEntity
        );
        return "회원가입 성공"
      } 
    } catch(error){
      if(error instanceof BadRequestException){
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 예측지표를 불러오는 중 오류가 발생했습니다. id 형식이 uuid인지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async signIn(authLoginDto: AuthLoginDto): Promise<{accessToken:string}> {
    const {name, password} = authLoginDto;
    const memberEntity = await this.memberRepository.findOneBy({name});
    console.log(memberEntity)

    if(memberEntity && await bcrypt.compare(password, memberEntity.password)) {
      const payload = { name };
      const accessToken = this.jwtService.sign(payload);
      return {accessToken}
    } else {
      throw new UnauthorizedException('login failed')
    }
  };

  async findById(memberId: string){
    return await this.memberRepository.findOneBy({ memberId });
  };

  async memberCheck(name: string){
    const member = await this.memberRepository.findOneBy({name: name});
    if(member){
      return true;
    } else{
      return false;
    }
  };
}