import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/decorator/user.decorator';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import { DeleteNotificationQueryDto } from './dto/delete-notification-query.dto';
import { NotificationOptionsQueryDto } from './dto/notification-options-query.dto';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll(
    @User('sub') userId: string,
    @Query() pagination: PaginationQueryDto,
    @Query() options: NotificationOptionsQueryDto,
  ) {
    return this.notificationService.findAll(pagination, options, { userId });
  }

  @Get('/unread-count')
  unreadCount(@User('sub') userId: string) {
    return this.notificationService.unreadCount(userId);
  }

  @Patch('read-all')
  readAll(@User('sub') userId: string) {
    return this.notificationService.readAll(userId);
  }

  @Get('one/:id')
  async findOne(@Param('id', ParseUUIDPipe) notificationId: string) {
    const notification = await this.notificationService.findOneBy({
      id: notificationId,
    });
    return { notification };
  }

  @Get(':id')
  findOneForCurrentUser(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.findOne(userId, notificationId);
  }

  @Patch(':id/read')
  readOne(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.readOne(userId, notificationId);
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  update(
    @Param('id') notificationId: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(notificationId, dto);
  }

  @Delete('/delete-by')
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  removeBy(@Query() deleteCondition: DeleteNotificationQueryDto) {
    return this.notificationService.removeBy(deleteCondition);
  }

  @Delete(':id')
  remove(@User('sub') userId: string, @Param('id') notificationId: string) {
    return this.notificationService.remove(userId, notificationId);
  }
}
