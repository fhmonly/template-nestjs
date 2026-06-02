import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformerInterceptor<T> implements NestInterceptor<
  T,
  any
> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;

        const success = statusCode >= 200 && statusCode < 400;

        if (response === null || response === undefined) {
          return { success, statusCode };
        }

        if (typeof response === 'string') {
          return {
            success,
            statusCode,
            message: response,
          };
        }

        if (typeof response === 'number') {
          return {
            success,
            statusCode,
            data: response,
          };
        }

        if (Array.isArray(response)) {
          return {
            success,
            statusCode,
            data: response,
          };
        }

        const { message, data, meta, ...rest } = response;

        const result: any = {
          success,
          statusCode,
        };

        if (message) result.message = message;

        if (data !== undefined) {
          result.data = data;
        }

        if (Object.keys(rest).length) {
          if (!result.data) result.data = rest;
          else Object.assign(result, rest);
        }

        if (meta) result.meta = meta;

        return result;
      }),
    );
  }
}
