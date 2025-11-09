import { IsEnum, IsString, Length } from 'class-validator';
import { ImageCategory } from 'src/types/upload.types';

export class DeleteImageDto {
  @IsString()
  @Length(1, 256)
  publicId: string;

  @IsEnum(ImageCategory)
  category: ImageCategory;
}
