import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheModule } from '../cache/cache.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CacheModule],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
