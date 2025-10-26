import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Component } from '../../component/entities/component.entity';

@Entity('car_types')
export class CarType extends MainFormat {
  @Column({ length: 100, unique: true })
  maker: string;

  @OneToMany(() => Car, (car) => car.type)
  cars: Car[];

  @ManyToMany(() => Component, (component) => component.carTypes, {
    cascade: true,
  })
  @JoinTable()
  components: Component[];
}
