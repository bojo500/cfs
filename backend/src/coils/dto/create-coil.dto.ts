import { IsString, IsNumber, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CoilStatus } from '../coil.entity';

export class CreateCoilDto {
  @ApiProperty({ example: 'COIL-001', description: 'Unique coil identifier' })
  @IsString()
  @IsNotEmpty()
  coilId: string;

  @ApiProperty({ example: 'S1', description: 'Storage location (e.g., S1, S2, S3, 30302, or 30302* for ready from current location)' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 1500, description: 'Coil width in mm' })
  @IsNumber()
  width: number;

  @ApiProperty({ example: 5000, description: 'Coil weight in kg' })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 'ORD-001', description: 'Order number (auto-creates load if new)', required: false })
  @IsString()
  @IsOptional()
  orderNumber?: string;

  @ApiProperty({ enum: CoilStatus, example: CoilStatus.NP, description: 'Coil status', required: false })
  @IsEnum(CoilStatus)
  @IsOptional()
  status?: CoilStatus;
}
