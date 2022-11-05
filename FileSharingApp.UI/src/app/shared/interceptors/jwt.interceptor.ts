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
import { User } from 'src/app/models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User | null;

    this.accountService.loggedOnUser$.pipe(
      take(1),
      tap(currentUser => {
        if(currentUser) { 
          request = request.clone({ // This clones the request if there is a user and this then allows us to then set the headers
            setHeaders: {
              Authorization: `Bearer ${currentUser.token}`
            }
          })
        }
      }) 
    ).subscribe(user => currentUser = user);
    
    return next.handle(request);
  }
}
