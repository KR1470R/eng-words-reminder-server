import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import TermObject from '../models/TermObject.type';
import { UUID, timingSafeEqual, createHmac } from 'crypto';
import { UnauthorizedException, ForbiddenException } from '../exceptions';

@Injectable()
export class CacheService extends RedisService {
  constructor(@InjectRedis('Cache') public readonly repository: Redis) {
    super();
  }

  public async processLoginUser(
    username: string,
    password: string,
  ): Promise<string> {
    const user_hmac = createHmac(
      'sha256',
      `${username}:${Buffer.from(password).toString('base64')}`,
    ).digest('hex');
    const existent_user_hmac = await this.oneGetProcess({
      key: `users:${user_hmac}`,
    });
    if (!existent_user_hmac) {
      throw new ForbiddenException('Wrong credentials.');
    }
    return existent_user_hmac;
  }

  public async processRegisterUser(
    username: string,
    password: string,
  ): Promise<string> {
    const user_hmac = createHmac(
      'sha256',
      `${username}:${Buffer.from(password).toString('base64')}`,
    ).digest('hex');
    const existent_user_hmac = await this.oneGetProcess({
      key: `users:${user_hmac}`,
    });
    if (
      existent_user_hmac &&
      user_hmac.length === existent_user_hmac.length &&
      timingSafeEqual(
        Buffer.from(user_hmac),
        Buffer.from(existent_user_hmac),
      )
    )
      throw new UnauthorizedException(
        'User with such creds already exists.',
      );
    await this.oneCreateProcess({
      key: `users:${user_hmac}`,
      value: user_hmac,
    });
    return user_hmac;
  }

  public async saveTermForUser(user_id: string, term: TermObject) {
    await this.oneCreateProcess({
      key: `users:${user_id}:terms:${term.hash}`,
      value: term.term,
    });
  }

  public async getUserDefinedTerm(
    user_id: string,
    term: TermObject,
  ): Promise<string> {
    const existentTermHash = await this.oneGetProcess({
      key: `users:${user_id}:terms:${term.hash}`,
    });
    return existentTermHash;
  }

  public async getAllTermsOfUser(user_id: string) {
    const user_terms = await this.repository.keys(
      `users:${user_id}:terms:*`,
    );
    return user_terms;
  }

  public async getAllUsersIds(): Promise<string[]> {
    const users_ids = await this.repository.keys(`users:*`);
    return users_ids as UUID[];
  }
}
