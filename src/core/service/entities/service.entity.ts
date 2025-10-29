import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Booking } from '../../booking/entities/booking.entity';
import { Review } from '../../reviews/entities/review.entity';
import { ComponentCategory } from '../../component-category/entities/component-category.entity';

export enum requiredCategoryStatus {
  EQUAL = 'equal',
  ONE_OR_MORE = 'one_or_more',
}

@Entity('services')
export class Service extends MainFormat {
  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  basePrice: number;

  @Column('text', { nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  estimatedDurationMin: number;

  @Column({
    enum: requiredCategoryStatus,
    default: requiredCategoryStatus.EQUAL,
  })
  requiredCategoryStatus: requiredCategoryStatus;

  @Column({ default: 0 })
  ratesSum: number;

  @Column({ default: 0 })
  ratesCount: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @ManyToMany(() => ComponentCategory, (category) => category.services)
  @JoinTable()
  categories: ComponentCategory[];
}
