import { IsNotEmpty, MinLength } from 'class-validator';

export default class RegisterUserDto {
  @IsNotEmpty()
  @MinLength(5, { message: 'Username should be at least 7 symbols' })
  username: string;

  @IsNotEmpty()
  @MinLength(10, { message: 'Password should be at least 10 symbols' })
  password: string;
}
