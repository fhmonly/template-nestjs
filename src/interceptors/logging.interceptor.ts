import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = ctx.switchToHttp().getResponse();
        console.log(
          `${req.method} ${req.url} ${res.statusCode} - ${Date.now() - start}ms`,
        );
      }),
    );
  }
}
