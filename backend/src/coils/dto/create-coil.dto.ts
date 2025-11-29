import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCoilDto {
  @IsString()
  @IsNotEmpty()
  coilId: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  width: number;

  @IsNumber()
  weight: number;

  @IsString()
  @IsOptional()
  orderNumber?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
