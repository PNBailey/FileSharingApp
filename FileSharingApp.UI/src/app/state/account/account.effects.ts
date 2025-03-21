import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { AccountService } from "src/app/services/account.service";
import { AccountApiActions, AccountActions } from "./account.actions";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { getLoggedOnUser } from "./account.selectors";
import { MessageHandlingService } from "src/app/services/message-handling.service";
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from "src/app/models/snackbar-item";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/user";
import { LoadingBoolName } from "../loading/loading.reducer";
import { LoadingActions } from "../loading/loading.actions";
import { FilesActions } from "../file/file.actions";
import { FolderActions } from "../folder/folder.actions";

@Injectable()
export class AccountEffects {

    loginOrRegister$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.loginOrRegister),
            switchMap(action => this.accountService.loginOrRegister(action.user, action.url)),
            map((user) => AccountApiActions.loginOrRegisterSuccessful({ user: user }))
        )
    );

    loginOrRegisterSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountApiActions.loginOrRegisterSuccessful),
            tap(() => {
                this.dialog.closeAll();
                this.router.navigate(['/files']);
            }),
            map((action) => AccountActions.setLoggedOnUser({ user: action.user }))
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
            ofType(AccountActions.logout),
            mergeMap(() => [
                FilesActions.clearFiles(),
                FolderActions.clearFolders(),
                AccountActions.setLoggedOnUser({ user: null })
            ]),
            tap(() => {
                this.router.navigateByUrl('/home');
            })
        )
    );

    uploadProfilePicture$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.uploadProfilePicture),
            switchMap((action) => {
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.UPDATING_PROFILE }));
                return this.userService.uploadProfilePicture(action.file).pipe(
                    map((response: { signedUrl: string }) => response.signedUrl)
                );
            }),
            withLatestFrom(this.store.select(getLoggedOnUser)),
            map(([signedUrl, loggedOnUser]) => {
                const updatedUser: User = {
                    ...loggedOnUser,
                    profilePictureUrl: signedUrl
                };
                return AccountApiActions.uploadProfilePictureSuccessful({ updatedUser: updatedUser });
            })
        )
    );

    uploadProfilePictureSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountApiActions.uploadProfilePictureSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Successfully Updated",
                    action: SnackbarAction.Close,
                    classType: SnackbarClassType.Success,
                    duration: SnackbarDuration.Medium
                });
            }),
            map((action) => {
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.UPDATING_PROFILE }));
                return AccountActions.setLoggedOnUser({ user: action.updatedUser })
            })
        )
    );

    userInfoUpdated$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.updateUserInfo),
            switchMap((action) => this.userService.updateUserInfo(action.updatedUser)),
            withLatestFrom(this.store.select(getLoggedOnUser)),
            map(([updatedUser, existingLoggedOnUser]) => {
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.UPDATING_PROFILE }));
                return AccountApiActions.updateUserInfoSuccessful({
                    updatedUser: {
                        ...existingLoggedOnUser,
                        ...updatedUser,
                        token: existingLoggedOnUser.token
                    }
                });
            })
        )
    )

    userInfoUpdateSuccessful$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountApiActions.updateUserInfoSuccessful),
            tap(() => {
                this.messageHandlingService.onDisplayNewMessage({
                    message: "Successfully Updated",
                    action: SnackbarAction.Close,
                    classType: SnackbarClassType.Success,
                    duration: SnackbarDuration.Medium
                });
            }),
            map((action) => {
                this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.UPDATING_PROFILE }));
                return AccountActions.setLoggedOnUser({ user: action.updatedUser })
            })
        )
    )

    constructor(
        private actions$: Actions,
        private accountService: AccountService,
        private dialog: MatDialog,
        private router: Router,
        private store: Store,
        private messageHandlingService: MessageHandlingService,
        private userService: UserService
    ) { }
}
