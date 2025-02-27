import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, finalize, first, map, Observable, switchMap, tap } from 'rxjs';
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

    usernameLoginFormValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.usernameExistsValidator(control.valueChanges).pipe(
                map(usernameDoesNotExist => usernameDoesNotExist ? { 'usernameDoesNotExist': true } : null)
            );
        };
    }

    usernameRegisterFormValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.usernameExistsValidator(control.valueChanges).pipe(
                map(usernameExists => usernameExists ? null : { 'usernameExists': true })
            );
        };
    }

    usernameExistsValidator(controlObs: Observable<string>): Observable<Boolean> {
        return controlObs.pipe(
            tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_USERNAME }))),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(controlValue => this.checkUsernameUnique(controlValue)),
            finalize(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_USERNAME }))),
            first()
        );
    }

    uniqueEmailValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | { string: boolean } | null> => control.valueChanges
            .pipe(
                tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_EMAIL }))),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this.checkEmailUnique(value)),
                finalize(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_EMAIL }))),
                map((usernameIsUnique: boolean) => (usernameIsUnique ? null : { 'emailUniquenessViolated': true })),
                first()
            );
    }

    uniqueFolderValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | { string: boolean } | null> => control.valueChanges
            .pipe(
                tap(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_FOLDERNAME }))),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this.checkFolderNameUnique(value)),
                finalize(() => this.store.dispatch(LoadingActions.toggleLoading({ loadingBoolName: LoadingBoolName.CHECKING_FOLDERNAME }))),
                map((folderIsNotUnique: boolean) => (folderIsNotUnique ? { 'folderUniquenessViolated': true } : null)),
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
