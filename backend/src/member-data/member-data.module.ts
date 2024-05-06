import { Module } from '@nestjs/common';
import { MemberDataController } from './member-data.controller';
import { MemberDataService } from './member-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/auth/member.entity';
import { ProductEntiy } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UrlEntity } from './entities/url.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      ProductEntiy,
      UrlEntity,
    ]),
    AuthModule
  ],
  controllers: [MemberDataController],
  providers: [
    MemberDataService,
    AuthService,
    JwtService
  ],
})
export class MemberDataModule {}
