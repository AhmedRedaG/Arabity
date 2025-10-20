import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class MainFormat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
}
