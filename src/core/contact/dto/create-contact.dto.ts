import { IsEmail, IsString, Length } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 9999)
  message: string;
}
