import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MemberEntity } from './member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>
  ){}
  
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
    const {name, password} = authCredentialsDto;
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt);
    const memberEntity = this.memberRepository.create({name, password: hashedPassword});

    await this.memberRepository.save(
      this.mapDtoToEntity(authCredentialsDto, memberEntity)
    );
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const {name, password} = authCredentialsDto;
    const memberEntity = await this.memberRepository.findOneBy({name});

    if(memberEntity && await bcrypt.compare(password, memberEntity.password)) {
      return 'login success'
    } else {
      throw new UnauthorizedException('login failed')
    }
  }

  async findById(memberId: string){
    return await this.memberRepository.findOneBy({ memberId });
  }

  mapDtoToEntity(authCredentialsDto: AuthCredentialsDto, memberEntity: MemberEntity): MemberEntity{
    memberEntity.memberId = authCredentialsDto.memberId;
    memberEntity.name = authCredentialsDto.name;
    memberEntity.password = authCredentialsDto.password;
    return memberEntity
  }
}
