import { Injectable } from '@nestjs/common';
import { DatasetService } from '../dataset/dataset.service';
import { CacheService } from '../cache/cache.service';
import TermObject from 'src/models/TermObject.type';
import {
  ConflictException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatasetUserService {
  public readonly maxTermsPerRequest: number;

  constructor(
    private datasetService: DatasetService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {
    this.maxTermsPerRequest = parseInt(
      this.configService.get('MAX_TERMS_PER_REQUEST'),
    );
  }

  public async allUserTerms(user_id: string) {
    return (await this.cacheService.getAllTermsOfUser(user_id)).length;
  }

  public get totalTerms() {
    return this.datasetService.data.length;
  }

  private getRandomTerm(): Promise<TermObject> {
    return new Promise((resolve, reject) => {
      try {
        const rand_term = this.datasetService.data.at(
          Math.floor(Math.random() * this.datasetService.data.length),
        );
        resolve(rand_term);
      } catch (err) {
        reject(err);
      }
    });
  }

  private validateUserAmountRequest(amount: number, ignoreLimit: boolean) {
    if (!ignoreLimit && amount > this.maxTermsPerRequest) {
      throw new MethodNotAllowedException(
        `No more than ${this.maxTermsPerRequest} terms per request is allowed`,
      );
    }
    if (amount > this.datasetService.data.length)
      throw new MethodNotAllowedException(
        `Desirable amount(${amount}) of terms exceeds actual length of terms(${this.datasetService.data.length})`,
      );
  }

  private async collectUniqueTerms(user_id: string, amount: number) {
    const tempUniqueTerms: Set<TermObject> = new Set();
    while (tempUniqueTerms.size !== amount) {
      const term = await this.getRandomTerm();
      const foundUserTerm = await this.cacheService.getUserDefinedTerm(
        user_id,
        term,
      );
      if (foundUserTerm) continue;
      tempUniqueTerms.add(term);
    }
    return tempUniqueTerms;
  }

  private async saveAllTermsUser(user_id: string, terms: Set<TermObject>) {
    await Promise.all(
      Array.from(terms.values()).map((term: TermObject) =>
        this.cacheService.saveTermForUser(user_id, term),
      ),
    );
  }

  public async clearUserTerms(user_id: string) {
    await this.cacheService.clearUserTerms(user_id);
  }

  public async bookTermsForUser(
    user_id: string,
    amount?: number,
    repeat = false,
    ignoreLimit = false,
  ) {
    await this.cacheService.checkUserExists(user_id);
    amount = amount ?? this.maxTermsPerRequest;
    this.validateUserAmountRequest(amount, ignoreLimit);
    let all_user_terms_length = await this.allUserTerms(user_id);
    if (all_user_terms_length >= this.datasetService.data.length) {
      if (!repeat)
        throw new ConflictException(
          'The user learned all terms. Use "repeat" param to learn again.',
        );
      await this.clearUserTerms(user_id);
      all_user_terms_length = 0;
    }
    if (this.datasetService.data.length - all_user_terms_length < amount)
      amount = this.datasetService.data.length - all_user_terms_length;
    const tempUniqueTerms = await this.collectUniqueTerms(user_id, amount);
    await this.saveAllTermsUser(user_id, tempUniqueTerms);
    return Array.from(tempUniqueTerms);
  }
}
