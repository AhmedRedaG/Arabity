import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { Notification } from './entities/notification.entity';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';
import { UserService } from '../user/user.service';
import { NotificationOptionsQueryDto } from './dto/notification-options-query.dto';
import { DeleteNotificationQueryDto } from './dto/delete-notification-query.dto';
import { PushNotificationService } from '../push-notification/push-notification.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UserService,
    private utilsService: UtilsService,
    private pushNotificationService: PushNotificationService,
  ) {}

  async create(dto: CreateNotificationDto) {
    await this.userService.findOneBy({ id: dto.userId });

    await this.pushNotificationService.pushToOne({
      userId: dto.userId,
      title: dto.title,
      body: dto.message,
    });

    const notification = await this.notificationRepository.save(dto);
    return { notification };
  }

  async findAll(
    inPagination: PaginationQueryDto,
    inNotificationOptions: NotificationOptionsQueryDto,
    inCondition?: TypeOrmFindOptionsWhere<Notification>,
  ) {
    const { page, limit, offset } = this.utilsService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );

    const where = {};
    if (inCondition) {
      Object.assign(where, inCondition);
    }
    if (inNotificationOptions.isRead !== undefined) {
      where['isRead'] = inNotificationOptions.isRead;
    }
    if (inNotificationOptions.type) {
      where['type'] = inNotificationOptions.type;
    }

    const [notifications, total] =
      await this.notificationRepository.findAndCount({
        where,
        skip: offset,
        take: limit,
        order: {
          [inNotificationOptions.orderBy]: inNotificationOptions.orderDirection,
        },
      });

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return { pagination, notifications };
  }

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<Notification>) {
    const notification =
      await this.notificationRepository.findOneBy(findOptions);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async findOne(userId: string, notificationId: string) {
    const notification = await this.findOneBy({
      id: notificationId,
      userId,
    });
    return { notification };
  }

  async update(notificationId: string, dto: UpdateNotificationDto) {
    await this.findOneBy({ id: notificationId });
    if (dto?.userId) {
      await this.userService.findOneBy({ id: dto.userId });
    }
    await this.notificationRepository.update(notificationId, dto);
    return { message: 'notification updated successfully' };
  }

  async remove(userId: string, notificationId: string) {
    await this.findOneBy({ id: notificationId, userId });
    await this.notificationRepository.delete(notificationId);
    return { message: 'notification deleted successfully' };
  }

  async removeBy(dto: DeleteNotificationQueryDto) {
    const where = {};
    if (dto.userId) where['userId'] = dto.userId;
    if (dto.id) where['id'] = dto.id;
    if (dto.title) where['title'] = dto.title;
    if (dto.type) where['type'] = dto.type;
    if (dto.isRead !== undefined) where['isRead'] = dto.isRead;

    if (Object.keys(where).length === 0) {
      throw new BadRequestException(
        'You must provide at least one deletion criterion.',
      );
    }

    const deleteResult = await this.notificationRepository.delete(where);

    return {
      message: 'Notification(s) deleted successfully',
      affected: deleteResult.affected || 0,
    };
  }

  async unreadCount(userId: string) {
    const count = await this.notificationRepository.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return { count };
  }

  async readAll(userId: string) {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
    return { message: 'all notifications read successfully' };
  }

  async readOne(userId: string, notificationId: string) {
    await this.findOneBy({ id: notificationId, userId });
    await this.notificationRepository.update(notificationId, { isRead: true });
    return { message: 'notification read successfully' };
  }
}
