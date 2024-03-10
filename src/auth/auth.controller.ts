import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/guards/public.decorator';
import RegisterUserDto from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.OK)
  public register(@Body() registerDto: RegisterUserDto) {
    return this.authService.signUp(
      registerDto.username,
      registerDto.password,
    );
  }

  @Get('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: Record<string, string>) {
    return this.authService.signIn(loginDto.username, loginDto.password);
  }
}
