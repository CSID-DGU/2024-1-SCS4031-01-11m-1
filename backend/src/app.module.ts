import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MemberDataModule } from './member-data/member-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService
    }),
    AuthModule,
    MemberDataModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthModule,
  ],
})
export class AppModule {}
