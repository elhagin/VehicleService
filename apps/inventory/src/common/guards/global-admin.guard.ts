import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class GlobalAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest();
		const roles: string[] = req?.context?.roles || [];
		if (!roles.includes('GLOBAL_ADMIN')) {
			throw new ForbiddenException('GLOBAL_ADMIN required');
		}
		return true;
	}
}

