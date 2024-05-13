import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext()
  
  const app = await NestFactory.create(AppModule);

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
    
  await app.listen(3000);
}
bootstrap();
