import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/core/user/dto/create-user.dto';
import { UserService } from 'src/core/user/user.service';
import { LocalLoginDto } from './dto/login.dto';
import { JwtTypes } from '../../types/jwt.types';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { EmailService } from 'src/core/email/email.service';
import { Otp } from 'src/core/auth/entities/otp.entity';
import { AuthAttemptTypes } from '../../types/auth.types';
import { AuthUtilsService } from 'src/core/auth-utils/auth-utils.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private userService: UserService,
    private emailService: EmailService,
    private authUtilsService: AuthUtilsService,
  ) {}

  async register(dto: CreateUserDto) {
    dto.password = await this.authUtilsService.hashPassword(dto.password);

    const user = await this.userService.create(dto);
    await this.authUtilsService.createNewUserAuthAttempt(user.id);

    return { user };
  }

  async sendVerification(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('user already verified');
    }

    await this.authUtilsService.validateSendVerificationAttempts(user.id);

    const verificationToken = await this.authUtilsService.generateToken(
      { sub: user.id, role: user.role },
      JwtTypes.VER,
    );

    // to avoid I/O blocking
    this.emailService
      .sendVerifyTokenMail(user, verificationToken)
      .catch((error: Error) => {
        console.error(
          `Failed to send verification email for user ${user.id}:`,
          error.message,
        );
        throw error;
      });

    return { message: 'a verification link is being sent to your email.' };
  }

  async verify(verificationToken: string) {
    let userId: string;
    try {
      const { sub } = await this.authUtilsService.verifyToken(
        verificationToken,
        JwtTypes.VER,
      );
      userId = sub;
    } catch {
      return { success: false, message: 'invalid or expired token' };
    }

    const user = await this.userService.findOneBy({ id: userId });
    if (user.isVerified) {
      return { success: false, message: 'user already verified' };
    }
    await this.userService.confirmVerification(userId);

    return { success: true };
  }

  async login(loginDto: LocalLoginDto) {
    const { user, isValid } =
      await this.authUtilsService.validateUser(loginDto);

    if (user) {
      await this.authUtilsService.validateAuthAttempts(
        user.id,
        AuthAttemptTypes.LOGIN,
        isValid,
      );
    }

    if (!user || !isValid) {
      throw new UnauthorizedException('invalid email or password');
    }
    if (!user.isVerified) {
      throw new ForbiddenException('user not verified yet');
    }

    const accessToken = await this.authUtilsService.generateAuthTokens({
      sub: user.id,
      role: user.role,
    });

    return { user, accessToken };
  }

  logout() {
    return;
  }

  async sendResetPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    // for more security
    if (user) {
      const attemptsCount = await this.authUtilsService.validateSendOtpAttempts(
        user.id,
      );

      const otp = await this.authUtilsService.generateOtp(
        user.id,
        attemptsCount,
      );

      this.emailService.sendResetOtpMail(user, otp).catch((error: Error) => {
        console.error(
          `failed to send reset password email for user ${user.id}:`,
          error.message,
        );
        throw error;
      });
    }

    return {
      message:
        'if an account exists for this email, a password reset code has been sent.',
    };
  }

  async validateResetOtp(email: string, otpCode: number) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const otpRecord = await this.otpRepository.findOneBy({
      code: otpCode,
      user: { id: user.id },
      expiresAt: MoreThan(new Date()),
    });

    await this.authUtilsService.validateAuthAttempts(
      user.id,
      AuthAttemptTypes.RESET,
      otpRecord ? true : false,
    );

    if (!otpRecord) {
      throw new UnauthorizedException('invalid or expired otp');
    }
    await this.otpRepository.delete({ user });

    const resetToken = await this.authUtilsService.generateToken(
      { sub: user.id, role: user.role },
      JwtTypes.RESET,
    );

    return { resetToken };
  }

  async reset(resetToken: string, password: string) {
    const { sub: userId } = await this.authUtilsService.verifyToken(
      resetToken,
      JwtTypes.RESET,
    );
    const user = await this.userService.findOneBy({ id: userId });

    await this.userService.setPassword(user.id, password);

    return { message: 'password has been reset successfully' };
  }
}
