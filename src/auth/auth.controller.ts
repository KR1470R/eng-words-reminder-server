import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/auth/guards/public.decorator';
import { AuthUserRequestDto, SuccessAuthResponseDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('user authentification & authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register user to db and retrieve JWT token.',
  })
  @ApiOkResponse({
    type: SuccessAuthResponseDto,
    description: 'User registered successfully.',
  })
  @ApiForbiddenResponse({
    description: 'User with such login already exists.',
  })
  @Post('register')
  @Public()
  @HttpCode(HttpStatus.OK)
  public register(
    @Body() registerDto: AuthUserRequestDto,
  ): Promise<SuccessAuthResponseDto> {
    return this.authService.signUp(
      registerDto.username,
      registerDto.password,
    );
  }

  @ApiOperation({
    summary: 'Process login and generate/refresh JWT token.',
  })
  @ApiOkResponse({
    type: SuccessAuthResponseDto,
    description: 'JWT Token generated and ready to use.',
  })
  @ApiNotFoundResponse({
    description: 'User does not exists!',
  })
  @Get('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  public login(
    @Body() loginDto: AuthUserRequestDto,
  ): Promise<SuccessAuthResponseDto> {
    return this.authService.signIn(loginDto.username, loginDto.password);
  }
}
