import { Column, Entity, OneToMany } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Component } from './component.entity';

@Entity('component_categories')
export class ComponentCategory extends MainFormat {
  @Column({ length: 100, unique: true })
  name: string;

  @OneToMany(() => Component, (component) => component.category)
  components: Component[];
}
