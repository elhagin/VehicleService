import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, MaxLength } from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
	@IsUUID()
	dealerId!: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(200)
	model!: string;

	@IsNumber()
	@IsPositive()
	price!: number;

	@IsEnum(VehicleStatus)
	status!: VehicleStatus;
}

