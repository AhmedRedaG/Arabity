import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @Length(1, 9999)
  @IsOptional()
  comment?: string;
}
