import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  public register(@Body() registerDto: Record<string, string>) {
    return this.authService.signUp(
      registerDto.username,
      registerDto.password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('login')
  public login(@Body() loginDto: Record<string, string>) {
    return this.authService.signIn(loginDto.username, loginDto.password);
  }
}
