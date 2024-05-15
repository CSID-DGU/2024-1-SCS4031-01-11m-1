import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './utils/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MemberDataModule } from './member-data/member-data.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { VocModule } from './voc/voc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    AuthModule,
    MemberDataModule,
    VocModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

