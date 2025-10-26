import { IsAlpha, IsEmail, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @IsAlpha()
  @Length(1, 128)
  firstName: string;

  @IsAlpha()
  @Length(1, 128)
  lastName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  @Length(8, 256)
  password: string;
}
