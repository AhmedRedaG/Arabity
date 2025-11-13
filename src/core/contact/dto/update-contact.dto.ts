import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ContactStatus } from '../entities/contact.entity';

export class UpdateContactDto {
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsString()
  @Length(1, 9999)
  response?: string;
}
