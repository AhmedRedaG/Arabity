import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { OptionsQueryDto } from '../../../dto/options-query.dto';
import { NotificationType } from '../entities/notification.entity';

export class NotificationOptionsQueryDto extends OptionsQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): string | boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isRead?: boolean;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
