import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
    const {name, password, username} = authCredentialsDto;
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt);
    const memberEntity = this.memberRepository.create({name: name, username: username ,password: hashedPassword});
    await this.memberRepository.save(
      memberEntity
    );
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
  }
  async findById(memberId: string){
    return await this.memberRepository.findOneBy({ memberId });
  }
}