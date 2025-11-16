import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { DealersModule } from './dealers/dealers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AdminModule } from './admin/admin.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, DealersModule, VehiclesModule, AdminModule],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(TenantContextMiddleware).forRoutes('*');
	}
}

