import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import config from 'src/config/variables.config';

const { defaultPage, defaultLimit, maxLimit } = config().pagination;

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = defaultPage;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(maxLimit)
  @Type(() => Number)
  limit: number = defaultLimit;
}
