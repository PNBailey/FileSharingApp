import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AccountState } from 'src/app/state/account/account.reducer';
import { getLoggedOnUser } from 'src/app/state/account/account.selectors';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private accountStore: Store<{account: AccountState}>) {}
    newRequest: HttpRequest<unknown>;

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        this.newRequest = request;
        this.accountStore.select(getLoggedOnUser).pipe(
            take(1),
            tap(currentUser => {         
                if (currentUser) {          
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
