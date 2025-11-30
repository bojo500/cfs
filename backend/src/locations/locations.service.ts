import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { Coil } from '../coils/coil.entity';
import { LocationMap, LocationMapCell, LocationMapCoil } from './dto/location-map.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    @InjectRepository(Coil)
    private coilsRepository: Repository<Coil>,
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

  async getLocationMap(): Promise<LocationMap> {
    const coils = await this.coilsRepository.find();

    // Group coils by location
    const coilsByLocation: Record<string, Coil[]> = {};
    coils.forEach(coil => {
      if (!coilsByLocation[coil.location]) {
        coilsByLocation[coil.location] = [];
      }
      coilsByLocation[coil.location].push(coil);
    });

    // Main Grid: 6 rows × 4 columns
    // Column: 1 (Right) to 4 (Left)
    // Row: 1 (South/Bottom) to 6 (North/Top)
    // ID Format: [Section][0][Col][0][Row] = 3 + 0 + Col + 0 + Row
    const rows = 6;
    const cols = 4;
    const cells: LocationMapCell[][] = [];

    // Build grid from North to South (Top to Bottom) for display
    // Row index 0 = Row 6 (North), Row index 5 = Row 1 (South)
    for (let displayRow = 0; displayRow < rows; displayRow++) {
      cells[displayRow] = [];
      const actualRow = rows - displayRow; // 6, 5, 4, 3, 2, 1

      // Build columns from Right to Left (Col 1 to Col 4)
      for (let actualCol = 1; actualCol <= cols; actualCol++) {
        const locationCode = `3${actualCol < 10 ? '0' : ''}${actualCol}${actualRow < 10 ? '0' : ''}${actualRow}`;
        const coilsInLocation = coilsByLocation[locationCode] || [];

        // Display column index (0-3 for left-to-right display)
        // Column 4 (leftmost) at index 0, Column 1 (rightmost) at index 3
        const displayCol = cols - actualCol;

        cells[displayRow][displayCol] = {
          locationCode,
          coils: coilsInLocation.map(c => ({
            coilId: c.coilId,
            status: c.status as string,
          })),
          coilCount: coilsInLocation.length,
          row: actualRow,
          col: actualCol,
        };
      }
    }

    // Special rows below the main grid (North to South order)
    const row126Coils = coilsByLocation['126'] || [];
    const s3Coils = coilsByLocation['S3'] || [];
    const truckReservingCoils = coilsByLocation['TRUCK'] || [];
    const s3osCoils = coilsByLocation['S3OS'] || [];

    return {
      cells,
      specialAreas: {
        row126: {
          locationCode: '126',
          coils: row126Coils.map(c => ({ coilId: c.coilId, status: c.status as string })),
          coilCount: row126Coils.length,
          row: 0,
          col: 0,
        },
        s3: {
          locationCode: 'S3',
          coils: s3Coils.map(c => ({ coilId: c.coilId, status: c.status as string })),
          coilCount: s3Coils.length,
          row: 0,
          col: 0,
        },
        truckReserving: {
          locationCode: 'TRUCK',
          coils: truckReservingCoils.map(c => ({ coilId: c.coilId, status: c.status as string })),
          coilCount: truckReservingCoils.length,
          row: 0,
          col: 0,
        },
        s3os: {
          locationCode: 'S3OS',
          coils: s3osCoils.map(c => ({ coilId: c.coilId, status: c.status as string })),
          coilCount: s3osCoils.length,
          row: 0,
          col: 0,
        },
      },
    };
  }
}
