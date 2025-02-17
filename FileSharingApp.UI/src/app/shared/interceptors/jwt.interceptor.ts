import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AccountState } from 'src/app/state/account/account.reducer';
import { getLoggedOnUser } from 'src/app/state/account/account.selectors';
import { tokenHasExpired } from '../helpers/jwt-helpers';
import { AccountActions } from 'src/app/state/account/account.actions';
import { MessageHandlingService } from 'src/app/services/message-handling.service';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from 'src/app/models/snackbar-item';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private accountStore: Store<{ account: AccountState }>,
        private messageHandlingService: MessageHandlingService
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.accountStore.select(getLoggedOnUser).pipe(
            take(1),
            switchMap(user => {
                if (!user) {
                    return next.handle(request);
                }

                if (tokenHasExpired(user.token)) {
                    this.accountStore.dispatch(AccountActions.logout());
                    this.messageHandlingService.onDisplayNewMessage({
                        message: "Session expired",
                        action: SnackbarAction.Close,
                        classType: SnackbarClassType.Info,
                        duration: SnackbarDuration.Medium
                    });
                    return EMPTY;
                }

                const authRequest = request.clone({
                    setHeaders: { Authorization: `Bearer ${user.token}` }
                });

                return next.handle(authRequest);
            })
        );
    }
}
