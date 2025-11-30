import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CoilsService } from './coils.service';
import { CreateCoilDto } from './dto/create-coil.dto';
import { UpdateCoilDto } from './dto/update-coil.dto';

@ApiTags('coils')
@Controller('coils')
export class CoilsController {
  constructor(private readonly coilsService: CoilsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all coils', description: 'Returns a list of all coils with their associated loads' })
  @ApiResponse({ status: 200, description: 'List of all coils' })
  findAll() {
    return this.coilsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coil by ID' })
  @ApiParam({ name: 'id', description: 'Coil ID' })
  @ApiResponse({ status: 200, description: 'Coil found' })
  @ApiResponse({ status: 404, description: 'Coil not found' })
  findOne(@Param('id') id: string) {
    return this.coilsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new coil', description: 'Creates a new coil and auto-creates load if orderNumber is provided' })
  @ApiResponse({ status: 201, description: 'Coil created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body(ValidationPipe) createCoilDto: CreateCoilDto) {
    return this.coilsService.create(createCoilDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update coil' })
  @ApiParam({ name: 'id', description: 'Coil ID' })
  @ApiResponse({ status: 200, description: 'Coil updated successfully' })
  @ApiResponse({ status: 404, description: 'Coil not found' })
  update(@Param('id') id: string, @Body(ValidationPipe) updateCoilDto: UpdateCoilDto) {
    return this.coilsService.update(+id, updateCoilDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete coil' })
  @ApiParam({ name: 'id', description: 'Coil ID' })
  @ApiResponse({ status: 200, description: 'Coil deleted successfully' })
  @ApiResponse({ status: 404, description: 'Coil not found' })
  remove(@Param('id') id: string) {
    return this.coilsService.remove(+id);
  }
}
