import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import TermObject from '../models/TermObject.type';
import { UUID, timingSafeEqual, createHmac } from 'crypto';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CacheService extends RedisService {
  private ROOT_NAMESPACE = 'eng-words';
  private USERS_NAMESPACE = 'users';
  private TERMS_NAMESPACE = 'terms';

  constructor(@InjectRedis('Cache') protected readonly repository: Redis) {
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
    await this.checkUserExists(user_hmac);
    return user_hmac;
  }

  public async processRegisterUser(
    username: string,
    password: string,
  ): Promise<string> {
    const user_id = createHmac(
      'sha256',
      `${username}:${Buffer.from(password).toString('base64')}`,
    ).digest('hex');
    const existent_user_id = await this.oneGetProcess({
      key: `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:${user_id}`,
    });
    if (
      existent_user_id &&
      user_id.length === existent_user_id.length &&
      timingSafeEqual(Buffer.from(user_id), Buffer.from(existent_user_id))
    )
      throw new UnauthorizedException(
        'User with such creds already exists.',
      );
    await this.oneCreateProcess({
      key: `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:${user_id}`,
      value: user_id,
    });
    return user_id;
  }

  public async checkUserExists(user_id: string) {
    const user = await this.oneGetProcess({
      key: `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:${user_id}`,
    });
    if (!Boolean(user))
      throw new ForbiddenException(`User does not exists!`);
  }

  public async saveTermForUser(user_id: string, term: TermObject) {
    await this.checkUserExists(user_id);
    await this.oneCreateProcess({
      key: `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:${user_id}:${this.TERMS_NAMESPACE}:${term.hash}`,
      value: term.term,
    });
  }

  public async getUserDefinedTerm(
    user_id: string,
    term: TermObject,
  ): Promise<string> {
    await this.checkUserExists(user_id);
    const existentTermHash = await this.oneGetProcess({
      key: `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:${user_id}:${this.TERMS_NAMESPACE}:${term.hash}`,
    });
    return existentTermHash;
  }

  public async getAllTermsOfUser(user_id: string): Promise<string[]> {
    await this.checkUserExists(user_id);
    const user_terms = await this.repository.keys(
      `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:${user_id}:${this.TERMS_NAMESPACE}:*`,
    );
    return user_terms;
  }

  public async getAllUsersIds(): Promise<string[]> {
    const users_ids = await this.repository.keys(
      `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:*`,
    );
    return users_ids as UUID[];
  }

  public async clearUserTerms(user_id: string) {
    await this.checkUserExists(user_id);
    const terms_hashes = await this.getAllTermsOfUser(user_id);
    for (const term_path of terms_hashes)
      await this.repository.del(term_path);
  }
}
