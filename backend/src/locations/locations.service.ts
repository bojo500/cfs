import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return this.locationsRepository.find();
  }

  async findByCode(locationCode: string): Promise<Location> {
    let location = await this.locationsRepository.findOne({ where: { locationCode } });

    if (!location) {
      // Auto-create location if not exists with default capacity
      location = this.locationsRepository.create({
        locationCode,
        capacity: locationCode.match(/^S\d+/) ? 50 : 20, // S1, S2, S3 = 50, others = 20
        occupied: 0
      });
      await this.locationsRepository.save(location);
    }

    return location;
  }

  async updateOccupancy(locationCode: string, change: number): Promise<void> {
    const location = await this.findByCode(locationCode);
    location.occupied += change;
    if (location.occupied < 0) location.occupied = 0;
    await this.locationsRepository.save(location);
  }

  async updateCapacity(locationCode: string, capacity: number): Promise<Location> {
    const location = await this.findByCode(locationCode);
    location.capacity = capacity;
    await this.locationsRepository.save(location);
    return location;
  }

  async recalculateOccupancy(locationCode: string, count: number): Promise<void> {
    const location = await this.findByCode(locationCode);
    location.occupied = count;
    await this.locationsRepository.save(location);
  }
}
