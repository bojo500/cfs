import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all locations', description: 'Returns list of all locations with capacity info' })
  @ApiResponse({ status: 200, description: 'List of locations' })
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('map')
  @ApiOperation({ summary: 'Get location map', description: 'Returns a structured location map with coils in each cell' })
  @ApiResponse({ status: 200, description: 'Location map data' })
  getLocationMap() {
    return this.locationsService.getLocationMap();
  }

  @Put(':code')
  @ApiOperation({ summary: 'Update location capacity' })
  @ApiResponse({ status: 200, description: 'Capacity updated successfully' })
  updateCapacity(@Param('code') code: string, @Body('capacity') capacity: number) {
    return this.locationsService.updateCapacity(code, capacity);
  }
}
