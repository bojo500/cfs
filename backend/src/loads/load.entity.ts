import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Coil } from '../coils/coil.entity';

export enum LoadStatus {
  READY = 'Ready',
  MISSING = 'Missing',
  SHIPPED = 'Shipped'
}

@Entity('loads')
export class Load {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  loadId: string;

  @Column()
  orderNumber: string;

  @Column({ nullable: true })
  timeToShip: string;

  @Column({ nullable: true })
  truckTime: string;

  @Column({ nullable: true })
  shipDate: string;

  @Column({ nullable: true })
  clientName: string;

  @Column({
    type: 'enum',
    enum: LoadStatus,
    default: LoadStatus.MISSING
  })
  status: LoadStatus;

  @OneToMany(() => Coil, coil => coil.load, { eager: true })
  coils: Coil[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
