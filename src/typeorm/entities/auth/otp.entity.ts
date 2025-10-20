import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';

@Entity('otps')
export class Otp extends MainFormat {
  @Column()
  code: number;

  @Column('smallint', { default: 0 })
  attempts: number;

  @Column('timestamp')
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.otps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @Index()
  user: User;
}
