import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SubscriptionType } from '@prisma/client';

export class CreateDealerDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(200)
	name!: string;

	@IsEmail()
	@MaxLength(320)
	email!: string;

	@IsEnum(SubscriptionType)
	subscriptionType!: SubscriptionType;
}

