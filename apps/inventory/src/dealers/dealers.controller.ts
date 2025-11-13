import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DealersService } from './dealers.service';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Controller('dealers')
@UseGuards(TenantGuard)
@UseInterceptors(PaginationInterceptor)
export class DealersController {
	constructor(private readonly dealersService: DealersService) {}

	@Post()
	create(@Req() req: any, @Body() dto: CreateDealerDto) {
		return this.dealersService.create(req.context.tenantId, dto);
	}

	@Get(':id')
	getOne(@Req() req: any, @Param('id') id: string) {
		return this.dealersService.findOne(req.context.tenantId, id);
	}

	@Get()
	getMany(@Req() req: any) {
		const { page, pageSize, sortBy, sortOrder } = req.pagination;
		return this.dealersService.findMany(req.context.tenantId, page, pageSize, sortBy, sortOrder);
	}

	@Patch(':id')
	update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateDealerDto) {
		return this.dealersService.update(req.context.tenantId, id, dto);
	}

	@Delete(':id')
	remove(@Req() req: any, @Param('id') id: string) {
		return this.dealersService.delete(req.context.tenantId, id);
	}
}

