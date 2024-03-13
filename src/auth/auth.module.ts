import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheModule } from '../cache/cache.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    CacheModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) =>
        ({
          isGlobal: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '5h',
          },
        } as JwtModuleOptions),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
