import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Prisma, VehicleStatus } from '@prisma/client';

@Injectable()
export class VehiclesService {
	constructor(private readonly prisma: PrismaService) {}

	async create(tenantId: string, dto: CreateVehicleDto) {
		const dealer = await this.prisma.dealer.findFirst({ where: { id: dto.dealerId, tenant_id: tenantId } });
		if (!dealer) {
			throw new ForbiddenException('Dealer not in tenant');
		}
		return this.prisma.vehicle.create({
			data: {
				tenant_id: tenantId,
				dealerId: dto.dealerId,
				model: dto.model,
				price: new Prisma.Decimal(dto.price),
				status: dto.status,
			},
		});
	}

	async findOne(tenantId: string, id: string) {
		const vehicle = await this.prisma.vehicle.findFirst({ where: { id, tenant_id: tenantId } });
		if (!vehicle) throw new NotFoundException();
		return vehicle;
	}

	async findMany(
		tenantId: string,
		params: {
			model?: string;
			status?: VehicleStatus;
			priceMin?: number;
			priceMax?: number;
			subscription?: 'PREMIUM';
			page: number;
			pageSize: number;
			sortBy?: string;
			sortOrder?: 'asc' | 'desc';
		},
	) {
		const { model, status, priceMin, priceMax, subscription, page, pageSize, sortBy, sortOrder } = params;
		const where: Prisma.VehicleWhereInput = {
			tenant_id: tenantId,
			model: model ? { contains: model, mode: 'insensitive' } : undefined,
			status: status ?? undefined,
			price:
				priceMin != null || priceMax != null
					? {
							gte: priceMin != null ? new Prisma.Decimal(priceMin) : undefined,
							lte: priceMax != null ? new Prisma.Decimal(priceMax) : undefined,
					  }
					: undefined,
			...(subscription === 'PREMIUM'
				? {
						dealer: {
							subscriptionType: 'PREMIUM',
							tenant_id: tenantId,
						},
				  }
				: {}),
		};
		const total = await this.prisma.vehicle.count({ where });
		const data = await this.prisma.vehicle.findMany({
			where,
			orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
			skip: (page - 1) * pageSize,
			take: pageSize,
		});
		return {
			data,
			page,
			pageSize,
			total,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	async update(tenantId: string, id: string, dto: UpdateVehicleDto) {
		const existing = await this.prisma.vehicle.findFirst({ where: { id, tenant_id: tenantId } });
		if (!existing) throw new NotFoundException();
		if (dto.dealerId) {
			const dealer = await this.prisma.dealer.findFirst({ where: { id: dto.dealerId, tenant_id: tenantId } });
			if (!dealer) throw new ForbiddenException('Dealer not in tenant');
		}
		const updateData: Partial<{ dealerId: string; model: string; price: Prisma.Decimal; status: VehicleStatus }> = {};
		if (dto.dealerId !== undefined) updateData.dealerId = dto.dealerId;
		if (dto.model !== undefined) updateData.model = dto.model;
		if (dto.price !== undefined) updateData.price = new Prisma.Decimal(dto.price);
		if (dto.status !== undefined) updateData.status = dto.status;
		return this.prisma.vehicle.update({
			where: { id },
			data: updateData,
		});
	}

	async delete(tenantId: string, id: string) {
		const existing = await this.prisma.vehicle.findFirst({ where: { id, tenant_id: tenantId } });
		if (!existing) throw new NotFoundException();
		await this.prisma.vehicle.delete({ where: { id } });
		return { success: true };
	}
}

