import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { CarType } from './car-type.entity';
import { User } from '../../../user/entities/user.entity';
import { Booking } from '../booking/booking.entity';

export enum CarEngineType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
}

@Entity('cars')
export class Car extends MainFormat {
  @Column({ length: 100 })
  model: string;

  @Column('int', { nullable: true })
  year: number;

  @Column({ length: 20, enum: CarEngineType })
  engineType: CarEngineType;

  @Column({ length: 30, nullable: true })
  color: string;

  @ManyToOne(() => CarType, (carType) => carType.cars, {
    cascade: true,
  })
  @Index()
  type: CarType;

  @OneToMany(() => Booking, (booking) => booking.car)
  bookings: Booking[];

  @ManyToOne(() => User, (user) => user.cars, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @Index()
  user: User;
}
