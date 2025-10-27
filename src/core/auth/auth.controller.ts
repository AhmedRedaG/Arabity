import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Render,
} from '@nestjs/common';
import { CreateUserDto } from 'src/core/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalLoginDto } from './dto/login.dto';
import {
  ResetPasswordDto,
  validateResetOtpDto,
} from './dto/reset-password.dto';
import { ParseEmailPipe } from '../../pipe/email.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Get('verify-mail/:email')
  sendVerification(@Param('email', ParseEmailPipe) email: string) {
    return this.authService.sendVerification(email);
  }

  @Get('verify/:verificationToken')
  @Render('verify-result')
  verify(@Param('verificationToken') verificationToken: string) {
    return this.authService.verify(verificationToken);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LocalLoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout() {
    return this.authService.logout();
  }

  @Get('reset-mail/:email')
  sendResetPassword(@Param('email', ParseEmailPipe) email: string) {
    return this.authService.sendResetPassword(email);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  validateResetOtp(@Body() dto: validateResetOtpDto) {
    return this.authService.validateResetOtp(dto.email, +dto.otp);
  }

  @Patch('reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.reset(dto.resetToken, dto.password);
  }
}
