import { IsStrongPassword, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsStrongPassword()
  @Length(8, 256)
  oldPassword: string;

  @IsStrongPassword()
  @Length(8, 256)
  newPassword: string;
}
