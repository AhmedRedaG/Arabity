import { IsAlpha, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsAlpha()
  @Length(1, 128)
  @IsOptional()
  firstName?: string;

  @IsAlpha()
  @Length(1, 128)
  @IsOptional()
  lastName?: string;
}
