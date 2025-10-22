import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthAttempt } from 'src/typeorm/entities/auth/auth-attempt.entity';
import { EmailModule } from 'src/email/email.module';
import { Otp } from 'src/typeorm/entities/auth/otp.entity';

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
