import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/http-exception-filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  initializeTransactionalContext()
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join('./uploads/image'), {
    prefix: '/media',
  });

  //CORS 허용
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('11M Documentation')
    .addServer(process.env.SWAGGER_PREFIX)
    .setDescription('11M의 API 문서입니다.')
    .setVersion('0.0.0')
    .addBearerAuth(
      {type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',},
      'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
