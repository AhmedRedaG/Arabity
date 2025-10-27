import { Column, Entity, OneToMany } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Address } from '../../address/entities/address.entity';

@Entity('address_cites')
export class AddressCity extends MainFormat {
  @Column({ length: 100 })
  city: string;

  @OneToMany(() => Address, (address) => address.city)
  addresses: Address[];
}
