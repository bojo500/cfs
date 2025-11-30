import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CoilsModule } from './coils/coils.module';
import { LoadsModule } from './loads/loads.module';
import { LocationsModule } from './locations/locations.module';
import { StatsModule } from './stats/stats.module';
import { Coil } from './coils/coil.entity';
import { Load } from './loads/load.entity';
import { Location } from './locations/location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3307,
      username: process.env.DB_USERNAME || 'coilflow',
      password: process.env.DB_PASSWORD || 'coilflow123',
      database: process.env.DB_DATABASE || 'coilflow',
      entities: [Coil, Load, Location],
      synchronize: true, // Set to false in production
      logging: false,
    }),
    CoilsModule,
    LoadsModule,
    LocationsModule,
    StatsModule,
  ],
})
export class AppModule {}
