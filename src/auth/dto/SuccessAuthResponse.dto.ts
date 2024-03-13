import { ApiProperty } from '@nestjs/swagger';

export default class SuccessAuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NTZlMjNkNGM3NDAxYTliMzkzOTJiNjcyNGE4NGMzMGVlMDVjMTBlYmNjZTc1NDMwMDg4NWJiYmU4YTNkMmVhIiwiaWF0IjoxNzEwMzcwNzgzLCJleHAiOjE3MTAzNzA3ODN9.EOHm9OFA1p260Md6t57AEGLqoQjUz7vFBz8vftmcS60',
  })
  access_token: string;
}
