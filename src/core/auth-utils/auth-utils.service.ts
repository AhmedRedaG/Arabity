import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/core/user/user.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/core/user/entities/user.entity';
import { LocalLoginDto } from 'src/core/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, JwtTypes } from '../../types/jwt.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthAttempt } from 'src/core/auth-utils/entities/auth-attempt.entity';
import { Otp } from 'src/core/auth/entities/otp.entity';
import { randomInt } from 'crypto';
import {
  AuthAttemptConfig,
  JwtConfig,
  OtpConfig,
  VerificationConfig,
} from 'src/types/config.types';
import { AuthAttemptTypes } from '../../types/auth.types';

@Injectable()
export class AuthUtilsService {
  constructor(
    @InjectRepository(AuthAttempt)
    private authAttemptRepository: Repository<AuthAttempt>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async createNewUserAuthAttempt(userId: string) {
    await this.authAttemptRepository.save({ userId });
  }

  async validateUser(
    loginDto: LocalLoginDto,
  ): Promise<{ user: User | null; isValid: boolean }> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || !user.password) {
      return { user: null, isValid: false };
    }

    const isValidPassword = await this.validatePassword(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) {
      return { user, isValid: false };
    }

    delete user.password;

    return { user, isValid: true };
  }

  async validateSendOtpAttempts(userId: string): Promise<number> {
    const otpAttempt = await this.otpRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 1,
    });
    if (!otpAttempt.length) {
      return 0;
    }
    const lastOtpAttempt = otpAttempt[0];

    const attemptsCount = lastOtpAttempt.attempts;
    const lastAttemptAt = lastOtpAttempt.createdAt;
    const config = this.configService.get<OtpConfig>('otp')!;

    this.validateSendAttemptsLimit(attemptsCount, lastAttemptAt, config);

    return lastOtpAttempt.attempts;
  }

  async validateSendVerificationAttempts(userId: string) {
    const authAttempt = await this.authAttemptRepository.findOneBy({
      user: { id: userId },
    });

    if (!authAttempt) {
      throw new Error('no authAttempt fund for user: ' + userId);
    }

    const attemptsCount = authAttempt.verificationAttempts;
    const lastAttemptAt = authAttempt.lastVerificationAttempt;
    const config = this.configService.get<VerificationConfig>('verification')!;

    this.validateSendAttemptsLimit(attemptsCount, lastAttemptAt, config);

    authAttempt.verificationAttempts++;
    authAttempt.lastVerificationAttempt = new Date();

    return await this.authAttemptRepository.save(authAttempt);
  }

  validateSendAttemptsLimit(
    attemptsCount: number,
    lastAttemptAt: Date,
    config: VerificationConfig,
  ): void {
    const { maxAttempts, coolDown, maxCoolDown } = config;
    const now = new Date();

    if (attemptsCount >= maxAttempts) {
      throw new ForbiddenException(
        'too many attempts. please contact support.',
      );
    }

    const backBase = coolDown + 1000 * 60 * 5; // 5m for safe
    const lockUntil = new Date(
      lastAttemptAt.getTime() +
        Math.min(coolDown * 2 ** attemptsCount - backBase, maxCoolDown),
    );

    if (lockUntil > now) {
      throw new ForbiddenException(
        `too many attempts. try again after ${lockUntil.toLocaleString()} or contact support.`,
      );
    }
  }

  async validateAuthAttempts(
    userId: string,
    authType: AuthAttemptTypes,
    isValid: boolean,
  ): Promise<AuthAttempt> {
    const authAttempt = await this.authAttemptRepository.findOneBy({
      user: { id: userId },
    });

    if (!authAttempt) {
      throw new Error('no authAttempt fund for user: ' + userId);
    }

    const { maxAttempts, maxErrorMessage } =
      this.configService.get<AuthAttemptConfig>(`auth.${authType}`)!;

    if (authAttempt[authType] >= maxAttempts) {
      throw new ForbiddenException(
        `too many attempts. ${maxErrorMessage} or contact support.`,
      );
    }

    if (isValid) {
      await this.authAttemptRepository.update(authAttempt.id, {
        login: 0,
        reset: 0,
      });
    } else {
      await this.authAttemptRepository.increment(
        { id: authAttempt.id },
        authType,
        1,
      );
    }

    return authAttempt;
  }

  async generateOtp(userId: string, attemptsCount: number): Promise<number> {
    const { min, max, expiresInMS } = this.configService.get<OtpConfig>('otp')!;

    const code = randomInt(min, +max);
    const attempts = ++attemptsCount;
    const expiresAt = new Date(Date.now() + expiresInMS);

    await this.otpRepository.save({
      user: { id: userId },
      code,
      attempts,
      expiresAt,
    });

    return code;
  }

  async generateAuthTokens(payload: JwtPayload) {
    return this.generateToken(payload, JwtTypes.ACC);
  }

  async generateToken(payload: JwtPayload, tokenType: JwtTypes) {
    const { secret, expiresIn } = this.configService.get<JwtConfig>(
      `jwt.${tokenType}`,
    )!;

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });

    return token;
  }

  async verifyToken(token: string, tokenType: JwtTypes): Promise<JwtPayload> {
    const secret = this.configService.get(`jwt.${tokenType}.secret`) as string;
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret,
      });
    } catch {
      throw new UnauthorizedException('invalid or expired token');
    }

    return payload;
  }

  async hashPassword(password: string): Promise<string> {
    const rounds = this.configService.get<string>('bcrypt.rounds')!;
    return await bcrypt.hash(password, rounds);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
