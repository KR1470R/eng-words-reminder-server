import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from 'src/cache/cache.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule,
    JwtModule.register({
      global: false,
      secret: '123',
      signOptions: { expiresIn: '5h' },
    }),
  ],
  providers: [AuthService, CacheService],
  controllers: [AuthController],
})
export class AuthModule {}
