import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { CreateGoogleAuthDto } from './dto/create-google-auth.dto';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post()
  async googleAuth(@Body() dto: CreateGoogleAuthDto) {
    return this.googleAuthService.googleLogin(dto.googleToken);
  }
}
