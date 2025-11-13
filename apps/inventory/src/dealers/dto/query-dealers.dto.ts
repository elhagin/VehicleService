import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryDealersDto {
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
	@IsIn(['name', 'email', 'subscriptionType', 'createdAt'])
	sortBy?: string;

	@IsOptional()
	@IsString()
	@IsIn(['asc', 'desc'])
	sortOrder?: 'asc' | 'desc';
}

