import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoilsController } from './coils.controller';
import { CoilsService } from './coils.service';
import { Coil } from './coil.entity';
import { LoadsModule } from '../loads/loads.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coil]),
    forwardRef(() => LoadsModule),
    LocationsModule,
  ],
  controllers: [CoilsController],
  providers: [CoilsService],
  exports: [TypeOrmModule, CoilsService],
})
export class CoilsModule {}
