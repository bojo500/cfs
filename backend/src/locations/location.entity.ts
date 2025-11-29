import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  locationCode: string;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  occupied: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get freeSpace(): number {
    return this.capacity - this.occupied;
  }
}
