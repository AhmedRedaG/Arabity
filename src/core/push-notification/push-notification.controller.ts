import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import {
  CreateToAllPushNotificationDto,
  CreateToManyPushNotificationDto,
  CreateToOnePushNotificationDto,
} from './dto/create-push-notification.dto';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller('push-notifications')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Role(UserRole.ADMIN)
  @Post('one')
  pushToOne(@Body() dto: CreateToOnePushNotificationDto) {
    return this.pushNotificationService.pushToOne(dto);
  }

  @Role(UserRole.ADMIN)
  @Post('many')
  pushToMany(@Body() dto: CreateToManyPushNotificationDto) {
    return this.pushNotificationService.pushToMany(dto);
  }

  @Role(UserRole.ADMIN)
  @Post('all')
  pushToAll(@Body() dto: CreateToAllPushNotificationDto) {
    return this.pushNotificationService.pushToAll(dto);
  }
}
