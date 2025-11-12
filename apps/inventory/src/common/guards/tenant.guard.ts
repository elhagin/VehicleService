import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest();
		const tenantId: string | undefined = req?.context?.tenantId;
		if (!tenantId) {
			throw new ForbiddenException('Tenant context missing');
		}
		return true;
	}
}

