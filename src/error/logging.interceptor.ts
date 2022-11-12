import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError, map, catchError, tap } from 'rxjs';
import { logColor } from 'src/constants/constants';

export interface Response<T> {
  data: T;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  setColor(string: string | string[] | undefined, color: string) {
    return color + string + logColor.Reset;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const display = false;
    const req = context.getArgByIndex(1).req;
    const before = Date.now();
    let { method, path: url } = req;
    const { body, params, query } = req;
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.get('user-agent') || '';

    method = this.setColor(method, logColor.BgRed);
    ip = this.setColor(ip, logColor.BgBlue);
    url = this.setColor(this.setColor(url, logColor.FgBlack), logColor.BgGreen);

    console.log(`REQUEST: ${ip} ` + `${method} path: ${url}`);
    console.log('origin ', req.get('origin'));
    console.log('BODY: ', body);
    console.log('PARAM: ', params);
    console.log('QUERY: ', query);
    console.log('USER AGENET: ', userAgent);

    return next.handle().pipe(
      tap((res) => {
        const after = Date.now();
        display ? console.log(res) : null;
        if (display) {
          console.log(
            this.setColor(
              `RESPONSE TIME:::${after - before}ms`,
              logColor.BgRed,
            ),
          );
        }
      }),
    );
  }
}

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        let message = err.message;
        if (
          err.response &&
          err.response.message &&
          typeof err.response.message == 'object' &&
          err.response.message.length
        ) {
          message = err.response.message[0];
        } else if (
          err.response &&
          err.response.message &&
          typeof err.response.message == 'string'
        ) {
          message = err.response.message;
        }

        return throwError(
          () =>
            new HttpException(
              {
                statusCode: 400,
                succuss: false,
                message,
              },
              200,
            ),
        );
      }),
    );
  }
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map((data) => ({ statusCode: 200, succuss: true, data })));
  }
}
