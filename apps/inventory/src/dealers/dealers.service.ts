import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';

@Injectable()
export class DealersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(tenantId: string, dto: CreateDealerDto) {
		return this.prisma.dealer.create({
			data: {
				tenant_id: tenantId,
				name: dto.name,
				email: dto.email,
				subscriptionType: dto.subscriptionType,
			},
		});
	}

	async findOne(tenantId: string, id: string) {
		const dealer = await this.prisma.dealer.findFirst({ where: { id, tenant_id: tenantId } });
		if (!dealer) throw new NotFoundException();
		return dealer;
	}

	async findMany(tenantId: string, page: number, pageSize: number, sortBy?: string, sortOrder?: 'asc' | 'desc') {
		const where = { tenant_id: tenantId };
		const total = await this.prisma.dealer.count({ where });
		const data = await this.prisma.dealer.findMany({
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

	async update(tenantId: string, id: string, dto: UpdateDealerDto) {
		const existing = await this.prisma.dealer.findFirst({ where: { id, tenant_id: tenantId } });
		if (!existing) throw new NotFoundException();
		const updateData: Partial<{ name: string; email: string; subscriptionType: SubscriptionType }> = {};
		if (dto.name !== undefined) updateData.name = dto.name;
		if (dto.email !== undefined) updateData.email = dto.email;
		if (dto.subscriptionType !== undefined) updateData.subscriptionType = dto.subscriptionType;
		return this.prisma.dealer.update({
			where: { id },
			data: updateData,
		});
	}

	async delete(tenantId: string, id: string) {
		const existing = await this.prisma.dealer.findFirst({ where: { id, tenant_id: tenantId } });
		if (!existing) throw new NotFoundException();
		// Optional: ensure no cross-tenant deletes
		if (existing.tenant_id !== tenantId) {
			throw new ForbiddenException();
		}
		await this.prisma.vehicle.deleteMany({ where: { dealerId: id, tenant_id: tenantId } });
		await this.prisma.dealer.delete({ where: { id } });
		return { success: true };
	}
}

