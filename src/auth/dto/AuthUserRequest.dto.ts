import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class AuthUserRequestDto {
  @ApiProperty({
    example: 'Ryan_GoslingRulit123',
    minimum: 7,
  })
  @IsNotEmpty()
  @MinLength(5, { message: 'Username should be at least 7 symbols' })
  username: string;

  @ApiProperty({
    example: '1djje-ferqfpqehjfqjefmkl',
    description: 'Password should be strong enough.',
    minimum: 10,
  })
  @IsNotEmpty()
  @MinLength(10, { message: 'Password should be at least 10 symbols' })
  password: string;
}
