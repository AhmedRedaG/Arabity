import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { OptionsQueryDto } from '../../../dto/options-query.dto';
import { ContactStatus } from '../entities/contact.entity';

export class ContactOptionsQueryDto extends OptionsQueryDto {
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsEmail()
  email?: string;
}
