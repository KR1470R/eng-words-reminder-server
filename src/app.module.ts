import path from 'node:path';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatasetService } from './dataset/dataset.service';
import { RedisService } from './redis/redis.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheModule } from './cache/cache.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatasetUserModule } from './dataset-user/dataset-user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, 'configs', '.env'),
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: [
          {
            namespace: 'Cache',
            host: configService.get<string>('REDIS_CACHE_HOST'),
            port: Number(configService.get<string>('REDIS_CACHE_PORT')),
            db: Number(configService.get('REDIS_CACHE_DB')),
            password: configService.get('REDIS_CACHE_PASSWORD'),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ({
          isGlobal: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: '5h',
        } as JwtModuleOptions),
      inject: [ConfigService],
    }),
    CacheModule,
    AuthModule,
    DatasetUserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
      inject: [JwtService] as never,
    },
    AppService,
    DatasetService,
    RedisService,
  ],
})
export class AppModule {}
