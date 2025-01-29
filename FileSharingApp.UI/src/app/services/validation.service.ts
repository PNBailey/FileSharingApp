import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, finalize, first, map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { LoadingActions } from '../state/loading/loading.actions';
import { LoadingBoolName } from '../state/loading/loading.reducer';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    baseUrl = "https://localhost:7249/api";

    constructor(
        private store: Store,
        private http: HttpClient
    ) { }

    uniqueUsernameValidatorFn(mustBeUnique: boolean, originalUsername: string | null = null): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges.pipe(
                debounceTime(400),
                distinctUntilChanged(),
                tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_USERNAME }))),
                switchMap((controlValue) => this.checkUsernameUnique(controlValue)),
                withLatestFrom(control.valueChanges),
                map(([usernameIsUnique, controlValue]) => {
                    const isOriginalUsername =
                        !usernameIsUnique && mustBeUnique && controlValue === originalUsername;

                    const isValid =
                        (usernameIsUnique && mustBeUnique) ||
                        (!usernameIsUnique && !mustBeUnique) ||
                        isOriginalUsername;

                    return isValid ? null : { usernameUniquenessViolated: true };
                }),
                tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_USERNAME }))),
                first()
            );
        };
    }

    uniqueEmailValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | { string: boolean } | null> => control.valueChanges
            .pipe(
                debounceTime(400),
                tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_EMAIL }))),
                distinctUntilChanged(),
                switchMap(value => this.checkEmailUnique(value)),
                map((usernameIsUnique: boolean) => (usernameIsUnique ? null : { 'emailUniquenessViolated': true })),
                tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_EMAIL }))),
                first()
            );
    }

    uniqueFolderValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | { string: boolean } | null> => control.valueChanges
            .pipe(
                debounceTime(400),
                tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_FOLDERNAME }))),
                distinctUntilChanged(),
                switchMap(value => this.checkFolderNameUnique(value)),
                map((folderIsNotUnique: boolean) => (folderIsNotUnique ? { 'folderUniquenessViolated': true } : null)),
                tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_FOLDERNAME }))),
                first()
            );
    }

    checkUsernameUnique(username: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/Account/CheckUsername?username=${username}`);
    }

    checkEmailUnique(email: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/Account/CheckEmail?email=${email}`);
    }

    checkFolderNameUnique(folderName: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/Folder/CheckFolderName?folderName=${folderName}`);
    }
}
