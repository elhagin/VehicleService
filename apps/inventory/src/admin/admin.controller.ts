import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GlobalAdminGuard } from '../common/guards/global-admin.guard';

@Controller('admin')
@UseGuards(GlobalAdminGuard)
export class AdminController {
	constructor(private readonly prisma: PrismaService) {}

	@Get('dealers/countBySubscription')
	async countBySubscription() {
		const [basic, premium] = await Promise.all([
			this.prisma.dealer.count({ where: { subscriptionType: 'BASIC' } }),
			this.prisma.dealer.count({ where: { subscriptionType: 'PREMIUM' } }),
		]);
		return { BASIC: basic, PREMIUM: premium };
	}
}

