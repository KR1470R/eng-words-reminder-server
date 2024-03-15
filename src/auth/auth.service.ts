import { CacheService } from 'src/cache/cache.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private cacheService: CacheService,
    private jwtService: JwtService,
  ) {}

  public async signIn(username: string, password: string) {
    const user_id = await this.cacheService.processLoginUser(
      username,
      password,
    );
    if (!user_id)
      throw new ForbiddenException('Resource is not available');
    return {
      access_token: await this.jwtService.signAsync({ sub: user_id }),
    };
  }

  public async signUp(username: string, password: string) {
    const user_id = await this.cacheService.processRegisterUser(
      username,
      password,
    );
    if (!user_id)
      throw new ForbiddenException('Resource is not available');
    return {
      access_token: await this.jwtService.signAsync({ sub: user_id }),
    };
  }
}
