import {
  Controller,
  HttpCode,
  HttpStatus,
  Query,
  Put,
  Request,
} from '@nestjs/common';
import { DatasetUserService } from './dataset-user.service';

@Controller('dataset-user')
export class DatasetUserController {
  constructor(private datasetUserService: DatasetUserService) {}

  @Put('book-words')
  @HttpCode(HttpStatus.OK)
  public async book(
    @Query('amount') amount: number,
    @Query('repeat') repeat: boolean,
    @Request() req,
  ) {
    const reserved_terms = await this.datasetUserService.applyTermsForUser(
      req.user.sub,
      Number(amount),
      Boolean(repeat),
    );
    return reserved_terms;
  }
}
