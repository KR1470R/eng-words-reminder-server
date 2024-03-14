import { ApiProperty } from '@nestjs/swagger';

export default class SuccessAuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NTZlMjNkNGM3NDAxYT...',
  })
  access_token: string;
}
