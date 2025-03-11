import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, first, map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { getLoggedOnUser } from '../state/account/account.selectors';
import { AccountService } from './account.service';
import { FolderService } from './folder.service';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    baseUrl = "https://localhost:7249/api";

    constructor(
        private store: Store,
        private accountService: AccountService,
        private folderService: FolderService
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
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(controlValue => this.accountService.checkUsernameUnique(controlValue)),
            first()
        );
    }

    usernameEditProfileFormValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | { string: boolean } | null> => control.valueChanges
            .pipe(
                withLatestFrom(this.store.select(getLoggedOnUser)),
                filter(([newUsername, loggedOnUser]) => loggedOnUser.username != newUsername),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(([controlValue, loggedOnUser]) => this.accountService.checkUsernameUnique(controlValue)),
                map(usernameExists => usernameExists ? null : { 'usernameExists': true }),
                first()
            );
    }

    uniqueEmailEditProfileFormValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | { string: boolean } | null> => control.valueChanges
            .pipe(
                withLatestFrom(this.store.select(getLoggedOnUser)),
                filter(([newEmail, loggedOnUser]) => loggedOnUser.email != newEmail),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(([controlValue, loggedOnUser]) => this.accountService.checkEmailUnique(controlValue)),
                map(usernameIsUnique => usernameIsUnique ? null : { 'emailUniquenessViolated': true }),
                first()
            );
    }

    uniqueEmailRegisterFormValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | { string: boolean } | null> => control.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(controlValue => this.accountService.checkEmailUnique(controlValue)),
                map(usernameIsUnique => usernameIsUnique ? null : { 'emailUniquenessViolated': true }),
                first()
            );
    }

    uniqueFolderValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | { string: boolean } | null> => control.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this.folderService.checkFolderNameUnique(value)),
                map(folderIsNotUnique => folderIsNotUnique ? { 'folderUniquenessViolated': true } : null),
                first()
            );
    }
}
