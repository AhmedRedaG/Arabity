import {
  IsEmail,
  IsJWT,
  IsNumberString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class validateResetOtpDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(6, 6)
  otp: number;
}

export class ResetPasswordDto {
  @IsJWT()
  resetToken: string;

  @IsStrongPassword()
  @Length(8, 256)
  password: string;
}
