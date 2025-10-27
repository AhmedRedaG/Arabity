import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/core/user/user.module';
import { AuthAttempt } from 'src/core/auth/entities/auth-attempt.entity';
import { EmailModule } from 'src/core/email/email.module';
import { Otp } from 'src/core/auth/entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthAttempt, Otp]),
    UserModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
