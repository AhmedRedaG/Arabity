import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';

@Entity('auth_attempts')
export class AuthAttempt extends MainFormat {
  @Column('smallint', { default: 0 })
  verificationAttempts: number;

  @CreateDateColumn()
  lastVerificationAttempt: Date;

  @Column('smallint', { default: 0 })
  login: number;

  @Column('smallint', { default: 0 })
  reset: number;

  @OneToOne(() => User, (user) => user.authAttempt, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  user: User;
}
