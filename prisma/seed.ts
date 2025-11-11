import { PrismaClient, SubscriptionType, VehicleStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Create tenants and dealers
	const tenant1 = 'tenant1';
	const tenant2 = 'tenant2';

	// Clear existing seed data (optional - comment out if you want to keep existing data)
	await prisma.vehicle.deleteMany({});
	await prisma.dealer.deleteMany({});

	// Tenant 1 dealers
	const dealer1 = await prisma.dealer.upsert({
		where: { email: 'abc@example.com' },
		update: {},
		create: {
			tenant_id: tenant1,
			name: 'ABC Motors',
			email: 'abc@example.com',
			subscriptionType: SubscriptionType.BASIC,
		},
	});

	const dealer2 = await prisma.dealer.upsert({
		where: { email: 'premium@example.com' },
		update: {},
		create: {
			tenant_id: tenant1,
			name: 'Premium Auto',
			email: 'premium@example.com',
			subscriptionType: SubscriptionType.PREMIUM,
		},
	});

	// Tenant 2 dealer
	const dealer3 = await prisma.dealer.upsert({
		where: { email: 'other@example.com' },
		update: {},
		create: {
			tenant_id: tenant2,
			name: 'Other Dealer',
			email: 'other@example.com',
			subscriptionType: SubscriptionType.BASIC,
		},
	});

	// Delete existing vehicles for these dealers to avoid duplicates
	await prisma.vehicle.deleteMany({
		where: {
			dealerId: {
				in: [dealer1.id, dealer2.id],
			},
		},
	});

	// Create vehicles for tenant1
	await prisma.vehicle.createMany({
		data: [
			{
				tenant_id: tenant1,
				dealerId: dealer1.id,
				model: 'Honda Civic',
				price: 25000,
				status: VehicleStatus.AVAILABLE,
			},
			{
				tenant_id: tenant1,
				dealerId: dealer2.id,
				model: 'Tesla Model 3',
				price: 45000,
				status: VehicleStatus.AVAILABLE,
			},
			{
				tenant_id: tenant1,
				dealerId: dealer2.id,
				model: 'BMW X5',
				price: 65000,
				status: VehicleStatus.SOLD,
			},
		],
	});

	console.log('Seed data created successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

