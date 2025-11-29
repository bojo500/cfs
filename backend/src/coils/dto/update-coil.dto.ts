import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCoilDto {
  @IsString()
  @IsOptional()
  coilId?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  orderNumber?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  isReadyFromCurrentLocation?: boolean;
}
