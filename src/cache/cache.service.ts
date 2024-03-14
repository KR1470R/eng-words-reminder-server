import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import TermObject from '../models/TermObject.type';
import { UUID, timingSafeEqual, createHmac } from 'crypto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class CacheService extends RedisService {
  private ROOT_NAMESPACE = 'eng-words';
  private USERS_NAMESPACE = 'users';
  private TERMS_NAMESPACE = 'terms';
  private AUTH_NAMESPACE = 'auth';

  constructor(@InjectRedis('Cache') protected readonly repository: Redis) {
    super();
  }

  public async processLoginUser(
    username: string,
    password: string,
  ): Promise<string> {
    const username_hmac = createHmac('sha256', username).digest('hex');
    const pass_hmac = createHmac('sha256', password).digest('hex');
    const user_id = Buffer.from(username_hmac).toString('base64');
    const parsed_user: { username_hmac: string; pass_hmac: string } =
      JSON.parse(await this.checkUserExists(user_id));
    if (
      username_hmac.length === parsed_user.username_hmac.length &&
      timingSafeEqual(
        Buffer.from(username_hmac),
        Buffer.from(parsed_user.username_hmac),
      ) &&
      pass_hmac.length === parsed_user.pass_hmac.length &&
      timingSafeEqual(
        Buffer.from(pass_hmac),
        Buffer.from(parsed_user.pass_hmac),
      )
    )
      return user_id;
    throw new ForbiddenException('Invalid password!');
  }

  public async processRegisterUser(
    username: string,
    password: string,
  ): Promise<string> {
    const username_hmac = createHmac('sha256', username).digest('hex');
    const user_id = Buffer.from(username_hmac).toString('base64');
    const existent_user = await this.checkUserExists(user_id, false);
    if (existent_user) {
      const parsed_user: { username_hmac: string; pass_hmac: string } =
        JSON.parse(existent_user);
      if (
        username_hmac.length === parsed_user.username_hmac.length &&
        timingSafeEqual(
          Buffer.from(parsed_user.username_hmac),
          Buffer.from(username_hmac),
        )
      )
        throw new ForbiddenException(
          'User with such login already exists.',
        );
    }
    const pass_hmac = createHmac('sha256', password).digest('hex');
    await this.oneCreateProcess({
      key: `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:${user_id}:${this.AUTH_NAMESPACE}`,
      value: JSON.stringify({ username_hmac, pass_hmac }),
    });
    return user_id;
  }

  public async checkUserExists(user_id: string, throwIfNotExists = true) {
    const user = await this.oneGetProcess({
      key: `${this.ROOT_NAMESPACE}:${this.USERS_NAMESPACE}:${user_id}:${this.AUTH_NAMESPACE}`,
    });
    if (!Boolean(user)) {
      if (throwIfNotExists)
        throw new NotFoundException(`User does not exists!`);
    } else return user;
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
