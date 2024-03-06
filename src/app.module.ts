import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatasetService } from './dataset/dataset.service';
import { RedisService } from './redis/redis.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheModule } from './cache/cache.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import path from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, 'configs', '.env'),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: [
          {
            namespace: 'Cache',
            host: configService.get('REDIS_CACHE_HOST'),
            port: Number(configService.get('REDIS_CACHE_PORT')),
            // password: configService.get('REDIS_CACHE_PASSWORD'),
            // db: Number(configService.get('REDIS_CACHE_DB')),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    CacheModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatasetService, RedisService],
})
export class AppModule {}
