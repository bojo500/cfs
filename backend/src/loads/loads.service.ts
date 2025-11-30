import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Load, LoadStatus } from './load.entity';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { Coil } from '../coils/coil.entity';

@Injectable()
export class LoadsService {
  constructor(
    @InjectRepository(Load)
    private loadsRepository: Repository<Load>,
    @InjectRepository(Coil)
    private coilsRepository: Repository<Coil>,
  ) {}

  async findAll(): Promise<Load[]> {
    return this.loadsRepository.find({ relations: ['coils'] });
  }

  async findOne(id: number): Promise<Load> {
    const load = await this.loadsRepository.findOne({
      where: { id },
      relations: ['coils'],
    });
    if (!load) {
      throw new NotFoundException(`Load with ID ${id} not found`);
    }
    return load;
  }

  async findByOrderNumber(orderNumber: string): Promise<Load | null> {
    return this.loadsRepository.findOne({
      where: { orderNumber },
      relations: ['coils'],
    });
  }

  async create(createLoadDto: CreateLoadDto): Promise<Load> {
    const load = this.loadsRepository.create(createLoadDto);
    const savedLoad = await this.loadsRepository.save(load);
    await this.updateLoadStatus(savedLoad.id);
    return this.findOne(savedLoad.id);
  }

  async update(id: number, updateLoadDto: UpdateLoadDto): Promise<Load> {
    const load = await this.findOne(id);
    Object.assign(load, updateLoadDto);
    await this.loadsRepository.save(load);

    // Don't auto-update status if it was manually set to Shipped
    if (updateLoadDto.status !== LoadStatus.SHIPPED) {
      await this.updateLoadStatus(id);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const load = await this.findOne(id);
    await this.loadsRepository.remove(load);
  }

  async updateStatus(id: number, status: LoadStatus): Promise<Load> {
    const load = await this.findOne(id);
    load.status = status;
    await this.loadsRepository.save(load);
    return this.findOne(id);
  }

  /**
   * UPDATED LOAD STATUS LOGIC
   * - MISSING: ANY coil is in S1 or S2, OR location contains "*" suffix
   * - READY: ALL coils are in S3 (no exceptions)
   * - SHIPPED: Manually set by user (becomes gray)
   */
  async updateLoadStatus(loadId: number): Promise<void> {
    const load = await this.findOne(loadId);

    // Don't auto-update if manually set to Shipped
    if (load.status === LoadStatus.SHIPPED) {
      return;
    }

    if (!load.coils || load.coils.length === 0) {
      load.status = LoadStatus.MISSING;
      await this.loadsRepository.save(load);
      return;
    }

    let isMissing = false;
    let allInS3 = true;

    for (const coil of load.coils) {
      // Check if coil is in S1 or S2
      if (coil.location === 'S1' || coil.location === 'S2') {
        isMissing = true;
        allInS3 = false;
        break;
      }

      // Check if location has * suffix (isReadyFromCurrentLocation)
      if (coil.isReadyFromCurrentLocation) {
        isMissing = true;
        allInS3 = false;
        break;
      }

      // Check if NOT in S3
      if (coil.location !== 'S3') {
        allInS3 = false;
      }
    }

    // Load is READY only if ALL coils are in S3
    // Load is MISSING if any coil is in S1/S2 or has * suffix
    if (isMissing) {
      load.status = LoadStatus.MISSING;
    } else if (allInS3) {
      load.status = LoadStatus.READY;
    } else {
      load.status = LoadStatus.MISSING;
    }

    await this.loadsRepository.save(load);
  }

  async getLoadsByDate(date: string): Promise<Load[]> {
    const loads = await this.findAll();
    return loads.filter(load => {
      // Check shipDate field first (YYYY-MM-DD format)
      if (load.shipDate) {
        return load.shipDate === date;
      }
      // Fallback to timeToShip for backward compatibility
      if (load.timeToShip) {
        try {
          const shipDate = new Date(load.timeToShip);
          if (!isNaN(shipDate.getTime())) {
            return shipDate.toISOString().split('T')[0] === date;
          }
        } catch (e) {
          // Invalid date, skip this load
          return false;
        }
      }
      return false;
    });
  }

  async getTodayLoads(): Promise<Load[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getLoadsByDate(today);
  }

  async getTomorrowLoads(): Promise<Load[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    return this.getLoadsByDate(tomorrowDate);
  }
}
