import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Column, Entity, UpdateDateColumn } from 'typeorm';

export enum ContactStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

@Entity('contacts')
export class Contact extends MainFormat {
  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  email: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.PENDING,
  })
  status: ContactStatus;

  @Column('text', { nullable: true })
  response: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
