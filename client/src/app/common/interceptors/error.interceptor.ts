import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationsService } from '../layouts/notifications/notifications.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notifications: NotificationsService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 500) {
          this.notifications.showToastError(err.error.message);
        }
        if (err.status === 404) {
          this.router.navigate(['404']);
        }
        if (err.status === 401) {
          this.notifications.showToastError(err.error.message);
          this.router.navigate(['/auth/login']);
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
