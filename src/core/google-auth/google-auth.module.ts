import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { UserModule } from '../user/user.module';
import { AuthUtilsModule } from '../auth-utils/auth-utils.module';

@Module({
  imports: [UserModule, AuthUtilsModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
