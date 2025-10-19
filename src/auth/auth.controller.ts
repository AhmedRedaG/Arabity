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
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalLoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    const data = this.authService.register(userDto);
    return data;
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async sendVerification(@Body() emailDto: EmailDto) {
    const data = await this.authService.sendVerification(emailDto.email);

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

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async sendResetPassword(@Body() emailDto: EmailDto) {
    const data = await this.authService.sendResetPassword(emailDto.email);

    return data;
  }

  @Patch('reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const data = await this.authService.reset(
      resetPasswordDto.email,
      +resetPasswordDto.otp,
      resetPasswordDto.password,
    );

    return data;
  }
}
