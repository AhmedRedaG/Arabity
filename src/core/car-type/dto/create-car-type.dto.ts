import { IsString, Length } from 'class-validator';

export class CreateCarTypeDto {
  @IsString()
  @Length(1, 100)
  maker: string;
}
