import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/core/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthAttempt } from 'src/typeorm/entities/auth/auth-attempt.entity';
import { Otp } from 'src/typeorm/entities/auth/otp.entity';
import { AuthUtilsService } from './auth-utils.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AuthAttempt, Otp]),
    JwtModule.register({}),
    forwardRef(() => UserModule),
  ],
  providers: [AuthUtilsService],
  exports: [AuthUtilsService],
})
export class AuthUtilsModule {}
