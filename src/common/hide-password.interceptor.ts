import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

export interface Response<T> {
  data: T;
}

@Injectable()
export class HidePasswordInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        if (data.user?.password) {
          return { ...data, user: _.omit(data.user, 'password') };
        }

        if (data?.password) {
          return _.omit(data, 'password');
        }

        return data;
      }),
    );
  }
}
