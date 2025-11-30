import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coil } from '../coils/coil.entity';
import { Load, LoadStatus } from '../loads/load.entity';
import { Location } from '../locations/location.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Coil)
    private coilsRepository: Repository<Coil>,
    @InjectRepository(Load)
    private loadsRepository: Repository<Load>,
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async getOverview() {
    const totalCoils = await this.coilsRepository.count();
    const totalLoads = await this.loadsRepository.count();

    const loads = await this.loadsRepository.find();
    const readyLoads = loads.filter(l => l.status === LoadStatus.READY).length;
    const missingLoads = loads.filter(l => l.status === LoadStatus.MISSING).length;
    const shippedLoads = loads.filter(l => l.status === LoadStatus.SHIPPED).length;

    const locations = await this.locationsRepository.find();
    const coils = await this.coilsRepository.find();

    // Group coils by location
    const coilsByLocation = coils.reduce((acc, coil) => {
      acc[coil.location] = (acc[coil.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate location stats
    const locationStats = locations.map(loc => ({
      locationCode: loc.locationCode,
      capacity: loc.capacity,
      occupied: loc.occupied,
      freeSpace: loc.freeSpace,
      coilCount: coilsByLocation[loc.locationCode] || 0,
    }));

    // Count ready vs missing coils
    const readyCoils = coils.filter(c => c.location === 'S3' || c.isReadyFromCurrentLocation).length;
    const missingCoils = totalCoils - readyCoils;

    return {
      totalCoils,
      totalLoads,
      readyLoads,
      missingLoads,
      shippedLoads,
      readyCoils,
      missingCoils,
      locationStats,
      coilsByLocation,
    };
  }
}
