import { IsString, Length } from 'class-validator';

export class CreateComponentCategorieDto {
  @IsString()
  @Length(1, 100)
  name: string;
}
