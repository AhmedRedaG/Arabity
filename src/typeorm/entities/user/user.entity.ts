import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthAttempt } from '../auth/auth-attempt.entity';
import { Otp } from '../auth/otp.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 128 })
  firstName: string;

  @Column({ length: 128 })
  lastName: string;

  @Column({ length: 32, nullable: true })
  phone?: string;

  @Column({ length: 256, unique: true })
  email: string;

  @Column('text') // using hash
  password?: string;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => AuthAttempt, (authAttempt) => authAttempt.user)
  authAttempt: AuthAttempt;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];
}
