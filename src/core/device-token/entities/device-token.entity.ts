import { User } from 'src/core/user/entities/user.entity';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import {
  Column,
  Entity,
  Generated,
  Index,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
  DESKTOP = 'desktop',
  OTHER = 'other',
}

@Entity('device_tokens')
export class DeviceToken extends MainFormat {
  @Column({ unique: true })
  deviceToken: string;

  @Column({ enum: Platform, default: Platform.OTHER })
  platform: Platform;

  @Column({ unique: true })
  @Generated('uuid')
  deviceId: string;

  @Column({ default: true })
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.deviceTokens, {
    onDelete: 'CASCADE',
  })
  @Index()
  user: User;
  @Column()
  userId: string;
}
