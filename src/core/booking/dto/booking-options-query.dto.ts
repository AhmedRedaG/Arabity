import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from 'src/core/booking/entities/booking.entity';
import { OptionsQueryDto } from '../../../dto/options-query.dto';

export class BookingOptionsQueryDto extends OptionsQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
