import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Booking } from '../../../typeorm/entities/booking/booking.entity';
import { Review } from '../../../typeorm/entities/review/review.entity';
import { ComponentCategory } from '../../component-category/entities/component-category.entity';

export enum RequiredComponentCategoryStatus {
  EQUAL = '==',
  ONE_OR_MORE = '1+',
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
    enum: RequiredComponentCategoryStatus,
    default: RequiredComponentCategoryStatus.EQUAL,
  })
  requiredCategory: RequiredComponentCategoryStatus;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @ManyToMany(() => ComponentCategory, (category) => category.components)
  @JoinTable()
  categories: ComponentCategory[];
}
