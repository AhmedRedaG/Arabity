import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { Car } from './car.entity';
import { Component } from '../service/component.entity';

@Entity('car_types')
export class CarType extends MainFormat {
  @Column({ length: 100, unique: true })
  maker: string;

  @OneToOne(() => Car, (car) => car.type)
  car: Car;

  @ManyToMany(() => Component, (component) => component.carTypes, {
    cascade: true,
  })
  @JoinTable()
  components: Component[];
}
