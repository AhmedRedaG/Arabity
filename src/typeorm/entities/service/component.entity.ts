import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Service } from './service.entity';
import { ComponentCategory } from './component-category.entity';
import { BookingDetail } from '../booking/booking-detail.entity';
import { CarType } from '../car/car-type.entity';

@Entity('components')
export class Component extends MainFormat {
  @Column({ length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  price: number;

  @Column()
  estimatedDurationMin: number;

  @Column('text', { nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.component)
  bookingDetails: BookingDetail[];

  @ManyToOne(() => Service, (service) => service.components, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    cascade: true,
  })
  @Index()
  service: Service;

  @ManyToOne(() => ComponentCategory, (category) => category.components, {
    cascade: true,
  })
  @Index()
  category: ComponentCategory;

  @ManyToMany(() => CarType, (carType) => carType.components)
  carTypes: CarType[];
}
