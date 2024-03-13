import { ApiProperty } from '@nestjs/swagger';

export default class GetStatisticsDto {
  @ApiProperty({
    default: 10,
  })
  terms_learned: number;
  @ApiProperty({
    default: 1000,
  })
  terms_total: number;
}
