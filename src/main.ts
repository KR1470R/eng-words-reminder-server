import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import path from 'node:path';
import process from 'node:process';

configDotenv({
  path: path.join(__dirname, 'configs', '.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
