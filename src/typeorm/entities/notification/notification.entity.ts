import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { User } from '../user/user.entity';

export enum NotificationType {
  BOOKING = 'booking',
  PAYMENT = 'payment',
  REVIEW = 'review',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification extends MainFormat {
  @Column({ length: 150 })
  title: string;

  @Column('text')
  message: string;

  @Column({ length: 20, enum: NotificationType })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @Index()
  user: User;
}
