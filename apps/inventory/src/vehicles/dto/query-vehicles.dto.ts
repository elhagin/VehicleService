import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class QueryVehiclesDto {
	@IsOptional()
	@IsString()
	model?: string;

	@IsOptional()
	@IsEnum(VehicleStatus)
	status?: VehicleStatus;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	priceMin?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	priceMax?: number;

	@IsOptional()
	@IsString()
	@IsIn(['PREMIUM'])
	subscription?: 'PREMIUM';

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	pageSize?: number;

	@IsOptional()
	@IsString()
	@IsIn(['model', 'price', 'status', 'createdAt'])
	sortBy?: string;

	@IsOptional()
	@IsString()
	@IsIn(['asc', 'desc'])
	sortOrder?: 'asc' | 'desc';
}

