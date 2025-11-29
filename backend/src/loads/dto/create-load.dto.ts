import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateLoadDto {
  @IsString()
  @IsNotEmpty()
  loadId: string;

  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsString()
  @IsOptional()
  timeToShip?: string;

  @IsString()
  @IsOptional()
  clientName?: string;
}
