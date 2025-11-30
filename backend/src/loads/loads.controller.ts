import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LoadsService } from './loads.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { LoadStatus } from './load.entity';

@ApiTags('loads')
@Controller('loads')
export class LoadsController {
  constructor(private readonly loadsService: LoadsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all loads', description: 'Returns a list of all loads with their coils' })
  @ApiResponse({ status: 200, description: 'List of all loads' })
  findAll() {
    return this.loadsService.findAll();
  }

  @Get('today/list')
  @ApiOperation({ summary: 'Get today\'s loads', description: 'Returns loads scheduled to ship today' })
  @ApiResponse({ status: 200, description: 'List of today\'s loads' })
  getTodayLoads() {
    return this.loadsService.getTodayLoads();
  }

  @Get('tomorrow/list')
  @ApiOperation({ summary: 'Get tomorrow\'s loads', description: 'Returns loads scheduled to ship tomorrow' })
  @ApiResponse({ status: 200, description: 'List of tomorrow\'s loads' })
  getTomorrowLoads() {
    return this.loadsService.getTomorrowLoads();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get load by ID' })
  @ApiParam({ name: 'id', description: 'Load ID' })
  @ApiResponse({ status: 200, description: 'Load found' })
  @ApiResponse({ status: 404, description: 'Load not found' })
  findOne(@Param('id') id: string) {
    return this.loadsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new load' })
  @ApiResponse({ status: 201, description: 'Load created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body(ValidationPipe) createLoadDto: CreateLoadDto) {
    return this.loadsService.create(createLoadDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update load' })
  @ApiParam({ name: 'id', description: 'Load ID' })
  @ApiResponse({ status: 200, description: 'Load updated successfully' })
  @ApiResponse({ status: 404, description: 'Load not found' })
  update(@Param('id') id: string, @Body(ValidationPipe) updateLoadDto: UpdateLoadDto) {
    return this.loadsService.update(+id, updateLoadDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update load status' })
  @ApiParam({ name: 'id', description: 'Load ID' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Load not found' })
  updateStatus(@Param('id') id: string, @Body('status') status: LoadStatus) {
    return this.loadsService.updateStatus(+id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete load' })
  @ApiParam({ name: 'id', description: 'Load ID' })
  @ApiResponse({ status: 200, description: 'Load deleted successfully' })
  @ApiResponse({ status: 404, description: 'Load not found' })
  remove(@Param('id') id: string) {
    return this.loadsService.remove(+id);
  }
}
