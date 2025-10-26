import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Component } from './component.entity';
import { Service } from './service.entity';

@Entity('component_categories')
export class ComponentCategory extends MainFormat {
  @Column({ length: 100, unique: true })
  name: string;

  @OneToMany(() => Component, (component) => component.category)
  components: Component[];

  @ManyToMany(() => Service, (service) => service.categories)
  services: Service[];
}
