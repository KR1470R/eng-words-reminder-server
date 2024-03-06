import { CacheService } from 'src/cache/cache.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

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
    return {
      access_token: await this.jwtService.signAsync({ sub: user_id }),
    };
  }

  public async signUp(username: string, password: string) {
    const user_id = await this.cacheService.processRegisterUser(
      username,
      password,
    );
    return {
      access_token: await this.jwtService.signAsync({ sub: user_id }),
    };
  }
}
