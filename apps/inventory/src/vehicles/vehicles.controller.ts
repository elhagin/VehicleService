import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehiclesDto } from './dto/query-vehicles.dto';

@Controller('vehicles')
@UseGuards(TenantGuard)
@UseInterceptors(PaginationInterceptor)
export class VehiclesController {
	constructor(private readonly vehiclesService: VehiclesService) {}

	@Post()
	create(@Req() req: any, @Body() dto: CreateVehicleDto) {
		return this.vehiclesService.create(req.context.tenantId, dto);
	}

	@Get(':id')
	getOne(@Req() req: any, @Param('id') id: string) {
		return this.vehiclesService.findOne(req.context.tenantId, id);
	}

	@Get()
	getMany(@Req() req: any, @Query() query: QueryVehiclesDto) {
		const { page, pageSize, sortBy, sortOrder } = req.pagination;
		return this.vehiclesService.findMany(req.context.tenantId, {
			model: query.model,
			status: query.status,
			priceMin: query.priceMin,
			priceMax: query.priceMax,
			subscription: query.subscription,
			page,
			pageSize,
			sortBy,
			sortOrder,
		});
	}

	@Patch(':id')
	update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateVehicleDto) {
		return this.vehiclesService.update(req.context.tenantId, id, dto);
	}

	@Delete(':id')
	remove(@Req() req: any, @Param('id') id: string) {
		return this.vehiclesService.delete(req.context.tenantId, id);
	}
}

