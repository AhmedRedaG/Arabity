import { IsString, Length } from 'class-validator';

export class AnalyzeImageDto {
  @IsString()
  @Length(1, 256)
  prompt: string;
}
