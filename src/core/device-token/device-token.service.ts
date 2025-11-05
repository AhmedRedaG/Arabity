import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { DeviceToken } from './entities/device-token.entity';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
  ) {}

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<DeviceToken>) {
    const token = await this.deviceTokenRepository.findOneBy(findOptions);
    if (!token) {
      throw new NotFoundException('token not found');
    }
    return token;
  }

  async create(userId: string, dto: CreateDeviceTokenDto) {
    try {
      const existingToken = await this.findOneBy({
        userId,
        deviceToken: dto.deviceToken,
      });

      return { token: existingToken, isNew: false };
    } catch {
      const newToken = await this.deviceTokenRepository.save({
        userId,
        ...dto,
      });

      return { token: newToken, isNew: true };
    }
  }

  async refresh(userId: string, dto: UpdateDeviceTokenDto) {
    const existingToken = await this.findOneBy({
      userId,
      deviceId: dto.deviceId,
    });

    await this.deviceTokenRepository.update(existingToken.id, {
      deviceToken: dto.deviceToken,
      isActive: true,
    });

    return { message: 'token refreshed successfully' };
  }

  async getUserTokens(userId: string) {
    const tokens = await this.deviceTokenRepository.find({
      where: { userId, isActive: true },
    });
    return tokens.map((token) => token.deviceToken);
  }

  async invalidateToken(deviceToken: string) {
    await this.findOneBy({ deviceToken });
    await this.deviceTokenRepository.update(
      { deviceToken },
      { isActive: false },
    );
    return { message: 'token invalidated successfully' };
  }

  async deactivate(userId: string, deviceId?: string) {
    if (deviceId) {
      await this.findOneBy({ userId, deviceId });
      await this.deviceTokenRepository.update(
        { userId, deviceId },
        { isActive: false },
      );
    } else {
      await this.deviceTokenRepository.update({ userId }, { isActive: false });
    }
  }
}
