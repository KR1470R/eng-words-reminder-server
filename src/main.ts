import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import path from 'node:path';
import process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

configDotenv({
  path: path.join(__dirname, 'configs', '.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const globalPrefix = process.env.GLOBAL_PREFIX;
  if (globalPrefix && globalPrefix.length)
    app.setGlobalPrefix(globalPrefix);

  if (process.env.SERVER_ENV !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle('eng-words-reminder')
      .setDescription(
        'A node.js server which used for reminding and teaching english words to WearOS.',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          description: 'Auth token for all endpoints',
        },
        'jwt',
      )
      .setVersion('0.0.1')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
    });
    SwaggerModule.setup('docs', app, document, {
      customSiteTitle: 'Docs eng-words-reminder',
    });
  }

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
