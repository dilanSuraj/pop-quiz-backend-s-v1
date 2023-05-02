import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppLoggingInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        this.logger.info(
            `[AppLoggingInterceptor] REQUEST {${request.path}, ${request.method}} | USER-ID: ${
                request.user?.userId || 'Unknown'
            } | USER-IP: ${request.ip} | USER-AGENT: ${request.headers['user-agent']}`,
        );

        const now = Date.now();

        return next
            .handle()
            .pipe(
                tap(() =>
                    this.logger.info(
                        `[AppLoggingInterceptor] RESPONSE {${request.path}, ${request.method}} ${Date.now() - now}ms`,
                    ),
                ),
            );
    }
}
