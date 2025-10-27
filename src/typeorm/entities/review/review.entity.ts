import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { User } from '../../../core/user/entities/user.entity';
import { Booking } from '../../../core/booking/entities/booking.entity';
import { Service } from '../../../core/service/entities/service.entity';

@Entity('reviews')
export class Review extends MainFormat {
  @Column()
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    cascade: true,
  })
  @Index()
  user: User;

  @ManyToOne(() => Booking, (booking) => booking.reviews, { cascade: true })
  @Index()
  booking: Booking;

  @ManyToOne(() => Service, (service) => service.reviews, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    cascade: true,
  })
  @Index()
  service: Service;
}
