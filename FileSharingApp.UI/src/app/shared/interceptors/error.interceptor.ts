import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MessageHandlingService } from 'src/app/services/message-handling.service';
import { SnackbarAction, SnackbarClassType, SnackbarDuration, SnackBarItem } from 'src/app/models/snackbar-item';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private messageHandlingService: MessageHandlingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        if(httpErrorResponse.error.status >= 400 && httpErrorResponse.error.status < 500) {
          this.messageHandlingService.displayMessage({
            message: `${httpErrorResponse.error.title}`,
            action: SnackbarAction.Close,
            classType: SnackbarClassType.Error,
            duration: SnackbarDuration.Medium
          });
        }
        return throwError(() => httpErrorResponse);
      })
    );
  }
}
