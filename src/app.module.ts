import path from 'node:path';
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatasetUserModule } from './dataset-user/dataset-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, 'configs', '.env'),
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: [
          {
            namespace: 'Cache',
            host: configService.get<string>('REDIS_CACHE_HOST'),
            port: Number(configService.get<string>('REDIS_CACHE_PORT')),
            username: configService.get('REDIS_CACHE_USERNAME'),
            db: Number(configService.get('REDIS_CACHE_DB')),
            password: configService.get('REDIS_CACHE_PASSWORD'),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DatasetUserModule,
  ],
})
export class AppModule {}
