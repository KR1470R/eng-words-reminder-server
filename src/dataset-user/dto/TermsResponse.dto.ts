import { ApiProperty } from '@nestjs/swagger';

export default class TermResponseDto {
  @ApiProperty({
    description: 'SHA1 Hash of the term',
    default: '43401fba10860653023fa023aa8dd175c0ab232b',
  })
  hash: string;
  @ApiProperty({
    default: 'jellyfish',
  })
  term: string;
  @ApiProperty({
    default: ['медуза'],
  })
  meanings: string[];
}
