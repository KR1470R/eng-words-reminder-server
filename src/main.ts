import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import path from 'node:path';
import process from 'node:process';
import { ValidationPipe } from '@nestjs/common';

configDotenv({
  path: path.join(__dirname, 'configs', '.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
