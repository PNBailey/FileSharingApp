import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, first, map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { LoadingObsName, LoadingService } from 'src/app/services/loading.service';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    baseUrl = "https://localhost:7249/api/Account";

    constructor( 
    private loadingService: LoadingService,
    private http: HttpClient
    ) {}

    uniqueUsernameValidatorFn(mustBeUnique: boolean, originalUsername: string | null = null): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | {string : boolean} | null> => 
            control.valueChanges
                .pipe(
                    debounceTime(400),
                    tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.CHECKING_USERNAME)),
                    distinctUntilChanged(),
                    switchMap((controlValue) => this.checkUsernameUnique(controlValue)),
                    withLatestFrom(control.valueChanges),
                    map(
                        ([usernameIsUnique, controlValue]) => (
                            (usernameIsUnique && mustBeUnique) || 
            (!usernameIsUnique && !mustBeUnique) || 
            (!usernameIsUnique && mustBeUnique && controlValue == originalUsername) 
                                ? null : {'usernameUniquenessViolated': true})
                    ),
                    tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.CHECKING_USERNAME)),
                    first()
                );
    }

    uniqueEmailValidatorFn(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | {string : boolean} | null> => control.valueChanges
            .pipe(
                debounceTime(400),
                tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.CHECKING_EMAIL)),
                distinctUntilChanged(),
                switchMap(value => this.checkEmailUnique(value)),
                map((usernameIsUnique: boolean) => (usernameIsUnique ? null : {'emailUniquenessViolated': true})),
                tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.CHECKING_EMAIL)),
                first()
            );
    }

    checkUsernameUnique(username: string): Observable<boolean> {        
        return this.http.get<boolean>(`${this.baseUrl}/CheckUsername?username=${username}`);
    }
    
    checkEmailUnique(email: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/CheckEmail?email=${email}`);
    }
}
