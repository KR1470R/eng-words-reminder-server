import {
  Controller,
  HttpCode,
  HttpStatus,
  Query,
  Put,
  Request,
  Get,
  Delete,
} from '@nestjs/common';
import { DatasetUserService } from './dataset-user.service';

@Controller('dataset-user')
export class DatasetUserController {
  constructor(private datasetUserService: DatasetUserService) {}

  @Put('book-words')
  @HttpCode(HttpStatus.OK)
  public async book(
    @Request() req,
    @Query('amount') amount?: number,
    @Query('repeat') repeat?: boolean,
  ) {
    const reserved_terms = await this.datasetUserService.bookTermsForUser(
      req.user.sub,
      Number(amount),
      Boolean(repeat),
    );
    return reserved_terms;
  }

  @Get('statistic')
  @HttpCode(HttpStatus.OK)
  public async getUserStatistics(@Request() req) {
    return {
      terms_learned: await this.datasetUserService.allUserTerms(
        req.user.sub,
      ),
      terms_total: this.datasetUserService.totalTerms,
    };
  }

  @Delete('statistic')
  @HttpCode(HttpStatus.OK)
  public async clearUserStatistics(@Request() req) {
    await this.datasetUserService.clearUserTerms(req.user.sub);
  }
}
