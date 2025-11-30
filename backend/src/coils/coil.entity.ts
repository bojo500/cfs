import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Load } from '../loads/load.entity';

export enum CoilStatus {
  NP = 'NP',
  RTS = 'RTS',
  SCRAP = 'scrap'
}

@Entity('coils')
export class Coil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  coilId: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2 })
  width: number;

  @Column('decimal', { precision: 10, scale: 2 })
  weight: number;

  @Column({ nullable: true })
  orderNumber: string;

  @Column({
    type: 'enum',
    enum: CoilStatus,
    default: CoilStatus.NP
  })
  status: CoilStatus;

  @Column({ default: false })
  isReadyFromCurrentLocation: boolean;

  @ManyToOne(() => Load, load => load.coils, { nullable: true, onDelete: 'SET NULL' })
  load: Load;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
