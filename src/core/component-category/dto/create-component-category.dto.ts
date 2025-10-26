import { IsString, Length } from 'class-validator';

export class CreateComponentCategoryDto {
  @IsString()
  @Length(1, 100)
  name: string;
}
