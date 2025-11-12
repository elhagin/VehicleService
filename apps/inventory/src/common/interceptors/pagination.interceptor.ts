import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaginationParams {
	page: number;
	pageSize: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
		const pageSizeRaw = parseInt(req.query.pageSize as string, 10) || 20;
		const pageSize = Math.min(Math.max(1, pageSizeRaw), 100);
		const sortBy = req.query.sortBy as string | undefined;
		const sortOrder = ((req.query.sortOrder as string) || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
		req.pagination = { page, pageSize, sortBy, sortOrder };
		return next.handle().pipe(
			map((body) => {
				// If handler already returns envelope, pass-through
				if (body && typeof body === 'object' && 'data' in body && 'total' in body) {
					return body;
				}
				return body;
			}),
		);
	}
}

declare module 'express-serve-static-core' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Request {
		pagination?: PaginationParams;
	}
}

