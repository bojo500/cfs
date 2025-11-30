import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Coil } from '../coils/coil.entity';
import { Load } from '../loads/load.entity';
import { Location } from '../locations/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coil, Load, Location])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
