import { Injectable } from '@nestjs/common';
import { DatasetService } from '../dataset/dataset.service';
import { CacheService } from '../cache/cache.service';
import TermObject from 'src/models/TermObject.type';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class DatasetUserService {
  constructor(
    private datasetService: DatasetService,
    private cacheService: CacheService,
  ) {}

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

  public async applyTermsForUser(
    user_id: string,
    amount: number,
    repeat = false,
  ) {
    if (amount > this.datasetService.data.length)
      throw new InternalServerErrorException(
        `Desirable amount(${amount}) of terms exceeds actual length of terms(${this.datasetService.data.length})`,
      );
    const all_user_terms_length = (
      await this.cacheService.getAllTermsOfUser(user_id)
    ).length;
    if (
      all_user_terms_length >= this.datasetService.data.length &&
      !repeat
    ) {
      if (!repeat)
        throw new ConflictException(
          'The user learned all terms. Use "repeat" param to learn again.',
        );
      this.cacheService.clearUserTerms(user_id);
    }

    const tempUniqueTerms = new Set();
    while (tempUniqueTerms.size !== amount) {
      tempUniqueTerms.add(await this.getRandomTerm());
    }
    await Promise.all(
      Array.from(tempUniqueTerms.values()).map((term: TermObject) =>
        this.cacheService.saveTermForUser(user_id, term),
      ),
    );
    return Array.from(tempUniqueTerms.values());
  }
}
