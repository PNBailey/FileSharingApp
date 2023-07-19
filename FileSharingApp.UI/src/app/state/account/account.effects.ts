import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { AccountService } from "src/app/services/account.service";
import { AccountDialogActions, AccountApiActions, AccountAppCompActions, AccountActions } from "./account.actions";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Injectable()
export class AccountEffects {

    loginOrRegister$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountDialogActions.loginOrRegister),
            exhaustMap(action => this.accountService.loginOrRegister(action.user, action.url)
                .pipe(
                    map((user) => AccountApiActions.loginOrRegisterSuccessful({user: user})),
                    catchError(error => of(AccountApiActions.loginOrRegisterError(error)))
                )
            )
        )
    );

    loginOrRegisterSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountApiActions.loginOrRegisterSuccessful),
            tap(() => {
                this.dialog.closeAll();
                this.router.navigate(['/home']);                 
            }),
            map((action) => AccountActions.setLoggedOnUser({user: action.user}))
        )
    );

    setLoggedOnUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.setLoggedOnUser),
            tap((action) => {                
                localStorage.setItem('user', JSON.stringify(action.user));                
            })
        ), { dispatch: false }
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountAppCompActions.logout),
            map(() => AccountActions.setLoggedOnUser({user: null}))
        )
    );

    constructor(
        private actions$: Actions,
        private accountService: AccountService,
        private dialog: MatDialog,
        private router: Router
    ) {}
}
