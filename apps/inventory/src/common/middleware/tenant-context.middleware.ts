import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface RequestContext {
	tenantId: string;
	roles: string[];
}

declare module 'express-serve-static-core' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Request {
		context?: RequestContext;
	}
}

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
	use(req: Request, _res: Response, next: NextFunction) {
		const tenantId = req.header('X-Tenant-Id') || req.header('x-tenant-id');
		if (!tenantId) {
			throw new BadRequestException('Missing X-Tenant-Id header');
		}
		const rolesHeader = req.header('X-Roles') || req.header('x-roles');
		const roles = rolesHeader ? rolesHeader.split(',').map((r) => r.trim()).filter(Boolean) : [];
		req.context = { tenantId, roles };
		return next();
	}
}

