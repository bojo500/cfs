import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { CoilsService } from './coils.service';
import { CreateCoilDto } from './dto/create-coil.dto';
import { UpdateCoilDto } from './dto/update-coil.dto';

@Controller('coils')
export class CoilsController {
  constructor(private readonly coilsService: CoilsService) {}

  @Get()
  findAll() {
    return this.coilsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coilsService.findOne(+id);
  }

  @Post()
  create(@Body(ValidationPipe) createCoilDto: CreateCoilDto) {
    return this.coilsService.create(createCoilDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateCoilDto: UpdateCoilDto) {
    return this.coilsService.update(+id, updateCoilDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coilsService.remove(+id);
  }
}
