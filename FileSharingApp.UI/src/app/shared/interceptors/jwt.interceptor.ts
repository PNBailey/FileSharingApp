import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}
  newRequest: HttpRequest<unknown>;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.newRequest = request;
    this.accountService.loggedOnUser$.pipe(
      take(1),
      tap(currentUser => {        
        if(currentUser) { 
          this.newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${currentUser.token}`
            }
          })
        }
      }) 
      ).subscribe();
    return next.handle(this.newRequest);
  }
}
