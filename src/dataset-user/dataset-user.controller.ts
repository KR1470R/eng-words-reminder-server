import {
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  Request,
  Get,
  Delete,
  Body,
} from '@nestjs/common';
import { DatasetUserService } from './dataset-user.service';
import {
  BookTermsRequestDto,
  GetStatisticsDto,
  TermResponseDto,
} from './dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('vocabulary management')
@ApiBearerAuth('jwt')
@Controller('dataset-user')
export class DatasetUserController {
  constructor(private datasetUserService: DatasetUserService) {}

  @ApiOperation({
    description:
      'Retreive & book some vocabulary terms and their meanings for the user.',
  })
  @ApiOkResponse({
    type: [TermResponseDto],
    description: 'Operation proceed successfully and data returned.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT token provided.',
  })
  @ApiBody({
    required: false,
    type: BookTermsRequestDto,
  })
  @Put('book-words')
  @HttpCode(HttpStatus.OK)
  public async book(
    @Request() req,
    @Body() data?: BookTermsRequestDto,
  ): Promise<TermResponseDto[]> {
    const reserved_terms = await this.datasetUserService.bookTermsForUser(
      req.user.sub,
      data?.amount,
      data?.repeat,
      data?.ignoreLimit,
    );
    return reserved_terms;
  }

  @ApiOperation({
    description: 'Retrieve user progress.',
  })
  @ApiOkResponse({
    type: GetStatisticsDto,
    description: 'Operation proceed successfully and data returned.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT token provided.',
  })
  @Get('statistic')
  @HttpCode(HttpStatus.OK)
  public async getUserStatistics(
    @Request() req,
  ): Promise<GetStatisticsDto> {
    return {
      terms_learned: await this.datasetUserService.allUserTerms(
        req.user.sub,
      ),
      terms_total: this.datasetUserService.totalTerms,
    };
  }

  @ApiOperation({
    description: 'Clear user progress.',
  })
  @ApiOkResponse({
    description: 'Operation proceed successfully, no data returned.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT token provided.',
  })
  @Delete('statistic')
  @HttpCode(HttpStatus.OK)
  public async clearUserStatistics(@Request() req) {
    await this.datasetUserService.clearUserTerms(req.user.sub);
  }
}
