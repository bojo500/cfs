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
   * STRICT LOAD STATUS LOGIC
   * - Ready: All coils are in S3 OR have isReadyFromCurrentLocation = true
   * - Missing: At least one coil is in S1, S2, or other location AND does NOT have isReadyFromCurrentLocation = true
   * - Shipped: Manually set by user
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

    let allReady = true;

    for (const coil of load.coils) {
      const isReady = coil.location === 'S3' || coil.isReadyFromCurrentLocation === true;
      if (!isReady) {
        allReady = false;
        break;
      }
    }

    load.status = allReady ? LoadStatus.READY : LoadStatus.MISSING;
    await this.loadsRepository.save(load);
  }
}
