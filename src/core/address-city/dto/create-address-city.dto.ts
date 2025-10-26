import { IsString, Length } from 'class-validator';

export class CreateAddressCityDto {
  @IsString()
  @Length(1, 100)
  city: string;
}
