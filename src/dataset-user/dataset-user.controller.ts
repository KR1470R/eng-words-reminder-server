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
    @Request() req,
    @Query('amount') amount?: number,
    @Query('repeat') repeat?: boolean,
  ) {
    // try {
    const user_id = req.user.sub;
    const reserved_terms = await this.datasetUserService.applyTermsForUser(
      user_id,
      Number(amount),
      Boolean(repeat),
    );
    return reserved_terms;
    // }
  }
}
