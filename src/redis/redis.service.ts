import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import {
  RedisPayloadOne,
  RedisPayloadMany,
} from 'src/models/RedisPayload.type';

@Injectable()
export class RedisService {
  protected readonly repository: Redis;

  protected async oneCreateProcess(
    payload: RedisPayloadOne,
  ): Promise<void> {
    try {
      await this.repository.set(payload['key'], payload['value']);
    } catch (err) {
      err = err as Error;
      throw new Error(`Error at oneCreateProcess: ${err.message}`);
    }
  }

  protected async oneGetProcess(
    payload: RedisPayloadOne,
  ): Promise<string> {
    try {
      return await this.repository.get(payload['key']);
    } catch (err) {
      err = err as Error;
      throw new Error(`Error at oneGetProcess: ${err.message}`);
    }
  }

  protected async oneUpdateProcess(
    payload: RedisPayloadOne,
  ): Promise<void> {
    try {
      await this.repository.set(payload['key'], payload['value']);
    } catch (err) {
      err = err as Error;
      throw new Error(`Error at oneUpdateProcess: ${err.message}`);
    }
  }

  protected async oneDropProcess(
    payload: RedisPayloadOne,
  ): Promise<number> {
    try {
      return await this.repository.del(payload['key']);
    } catch (err) {
      err = err as Error;
      throw new Error(`Error at oneDropProcess: ${err.message}`);
    }
  }

  protected async manyGetProcess(payload: RedisPayloadMany) {
    try {
      return await (() => {
        return Promise.allSettled(
          payload['items'].map((item) =>
            this.oneGetProcess({ key: item['key'] }),
          ),
        );
      })();
    } catch (err) {
      err = err as Error;
      throw new Error(`Error at manyGetProcess: ${err.message}`);
    }
  }

  protected async manyCreateProcess(payload: RedisPayloadMany) {
    try {
      return await (() => {
        return Promise.allSettled(
          payload['items'].map((item) =>
            this.oneCreateProcess({
              key: item['key'],
              value: item['value'],
            }),
          ),
        );
      })();
    } catch (err) {
      err = err as Error;
      throw new Error(`Error at manyCreateProcess: ${err.message}`);
    }
  }

  protected async manyUpdateProcess(payload: RedisPayloadMany) {
    try {
      return await (() => {
        return Promise.allSettled(
          payload['items'].map((item) =>
            this.oneUpdateProcess({
              key: item['key'],
              value: item['value'],
            }),
          ),
        );
      })();
    } catch (err) {
      err = err as Error;
      throw new Error(`Error at manyUpdateProcess: ${err.message}`);
    }
  }

  protected async manyDropProcess(payload: RedisPayloadMany) {
    try {
      return await (() => {
        return Promise.allSettled(
          payload['items'].map((item) =>
            this.oneDropProcess({
              key: item['key'],
              value: item['value'],
            }),
          ),
        );
      })();
    } catch (err) {
      err = err as Error;
      throw new Error(`Error at manyDropProcess: ${err.message}`);
    }
  }
}
