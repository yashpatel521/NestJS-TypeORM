import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from "@nestjs/common";
import { Observable, throwError, map, catchError, tap } from "rxjs";
import { ForceLog, logColor, PrinLog } from "../constants/constants";

export interface Response<T> {
  data: T;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    const before = Date.now();
    let { method, path: url } = req;
    const { body, params, query } = req;
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.get("user-agent") || "";

    ForceLog(`REQUEST: ${ip} ` + `${method} path: ${url}`, logColor.BgBlue);
    PrinLog(`"origin:`);
    PrinLog(req.get("origin"));
    PrinLog(`BODY:`);
    PrinLog(body);
    PrinLog(`PARAM:`);
    PrinLog(params);
    PrinLog(`QUERY:`);
    PrinLog(query);
    PrinLog(`USER AGENET:`);
    PrinLog(userAgent);

    return next.handle().pipe(
      tap((res) => {
        const after = Date.now();
        PrinLog(res);
        ForceLog(`RESPONSE TIME:::${after - before}ms`, logColor.BgRed);
      })
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
          typeof err.response.message == "object" &&
          err.response.message.length
        ) {
          message = err.response.message[0];
        } else if (
          err.response &&
          err.response.message &&
          typeof err.response.message == "string"
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
              200
            )
        );
      })
    );
  }
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map((data) => ({ statusCode: 200, succuss: true, data })));
  }
}
