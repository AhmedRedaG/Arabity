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
import { ComponentCategory } from '../../component-category/entities/component-category.entity';
import { BookingDetail } from '../../booking/entities/booking-detail.entity';
import { CarType } from '../../car-type/entities/car-type.entity';

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

  @ManyToOne(() => ComponentCategory, (category) => category.components, {
    cascade: true,
  })
  @Index()
  category: ComponentCategory;

  @ManyToMany(() => CarType, (carType) => carType.components)
  carTypes: CarType[];
}
