import { IsString, IsOptional, IsEnum } from 'class-validator';
import { LoadStatus } from '../load.entity';

export class UpdateLoadDto {
  @IsString()
  @IsOptional()
  loadId?: string;

  @IsString()
  @IsOptional()
  orderNumber?: string;

  @IsString()
  @IsOptional()
  timeToShip?: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsEnum(LoadStatus)
  @IsOptional()
  status?: LoadStatus;
}
