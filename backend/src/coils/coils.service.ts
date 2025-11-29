import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coil } from './coil.entity';
import { CreateCoilDto } from './dto/create-coil.dto';
import { UpdateCoilDto } from './dto/update-coil.dto';
import { LoadsService } from '../loads/loads.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class CoilsService {
  constructor(
    @InjectRepository(Coil)
    private coilsRepository: Repository<Coil>,
    private loadsService: LoadsService,
    private locationsService: LocationsService,
  ) {}

  async findAll(): Promise<Coil[]> {
    return this.coilsRepository.find({ relations: ['load'] });
  }

  async findOne(id: number): Promise<Coil> {
    const coil = await this.coilsRepository.findOne({
      where: { id },
      relations: ['load'],
    });
    if (!coil) {
      throw new NotFoundException(`Coil with ID ${id} not found`);
    }
    return coil;
  }

  async create(createCoilDto: CreateCoilDto): Promise<Coil> {
    let location = createCoilDto.location;
    let isReadyFromCurrentLocation = false;

    // Handle location with * (e.g., "30302*")
    if (location.endsWith('*')) {
      location = location.slice(0, -1); // Remove the *
      isReadyFromCurrentLocation = true;
    }

    const coil = this.coilsRepository.create({
      ...createCoilDto,
      location,
      isReadyFromCurrentLocation,
    });

    // Auto-create load if orderNumber is provided
    if (createCoilDto.orderNumber) {
      let load = await this.loadsService.findByOrderNumber(createCoilDto.orderNumber);

      if (!load) {
        load = await this.loadsService.create({
          loadId: `LOAD-${createCoilDto.orderNumber}`,
          orderNumber: createCoilDto.orderNumber,
        });
      }

      coil.load = load;
    }

    const savedCoil = await this.coilsRepository.save(coil);

    // Update location occupancy
    await this.locationsService.updateOccupancy(location, 1);

    // Update load status if coil belongs to a load
    if (savedCoil.load) {
      await this.loadsService.updateLoadStatus(savedCoil.load.id);
    }

    return this.findOne(savedCoil.id);
  }

  async update(id: number, updateCoilDto: UpdateCoilDto): Promise<Coil> {
    const coil = await this.findOne(id);
    const oldLocation = coil.location;

    let newLocation = updateCoilDto.location || coil.location;
    let isReadyFromCurrentLocation = updateCoilDto.isReadyFromCurrentLocation ?? coil.isReadyFromCurrentLocation;

    // Handle location with * (e.g., "30302*")
    if (updateCoilDto.location && updateCoilDto.location.endsWith('*')) {
      newLocation = updateCoilDto.location.slice(0, -1);
      isReadyFromCurrentLocation = true;
    }

    // Update location occupancy if location changed
    if (newLocation !== oldLocation) {
      await this.locationsService.updateOccupancy(oldLocation, -1);
      await this.locationsService.updateOccupancy(newLocation, 1);
    }

    Object.assign(coil, {
      ...updateCoilDto,
      location: newLocation,
      isReadyFromCurrentLocation,
    });

    await this.coilsRepository.save(coil);

    // Update load status if coil belongs to a load
    if (coil.load) {
      await this.loadsService.updateLoadStatus(coil.load.id);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const coil = await this.findOne(id);
    const location = coil.location;
    const loadId = coil.load?.id;

    await this.coilsRepository.remove(coil);

    // Update location occupancy
    await this.locationsService.updateOccupancy(location, -1);

    // Update load status if coil belonged to a load
    if (loadId) {
      await this.loadsService.updateLoadStatus(loadId);
    }
  }
}
