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
  async register(@Body() userDto: CreateUserDto) {
    const data = this.authService.register(userDto);
    return data;
  }

  @Get('verify-mail/:email')
  async sendVerification(@Param('email', ParseEmailPipe) email: string) {
    const data = await this.authService.sendVerification(email);

    return data;
  }

  @Get('verify/:verificationToken')
  @Render('verify-result')
  async verify(@Param('verificationToken') verificationToken: string) {
    const data = await this.authService.verify(verificationToken);

    return data;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LocalLoginDto) {
    const data = await this.authService.login(loginDto);
    return data;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout() {
    this.authService.logout();

    return;
  }

  @Get('reset-mail/:email')
  async sendResetPassword(@Param('email', ParseEmailPipe) email: string) {
    const data = await this.authService.sendResetPassword(email);

    return data;
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async validateResetOtp(@Body() dto: validateResetOtpDto) {
    const data = await this.authService.validateResetOtp(dto.email, +dto.otp);

    return data;
  }

  @Patch('reset')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const data = await this.authService.reset(dto.resetToken, dto.password);

    return data;
  }
}
