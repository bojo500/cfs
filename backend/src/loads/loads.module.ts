import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadsController } from './loads.controller';
import { LoadsService } from './loads.service';
import { Load } from './load.entity';
import { CoilsModule } from '../coils/coils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Load]),
    forwardRef(() => CoilsModule),
  ],
  controllers: [LoadsController],
  providers: [LoadsService],
  exports: [TypeOrmModule, LoadsService],
})
export class LoadsModule {}
