import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, first, map, Observable, switchMap, tap } from 'rxjs';
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

  uniqueUsernameValidatorFn(userIsRegistering: boolean): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | {string : boolean} | null> => 
    control.valueChanges
        .pipe(
            tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.CHECKING_USERNAME)),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((controlValue) => this.checkUsernameUnique(controlValue)),
            map((unique: boolean) => ((unique && userIsRegistering) || (!unique && !userIsRegistering) ? null : {'usernameUniquenessViolated': true})),
            finalize(() => this.loadingService.toggleLoadingObs(LoadingObsName.CHECKING_USERNAME)),
            first()
        );
    }

    uniqueEmailValidatorFn(): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | {string : boolean} | null> => control.valueChanges
          .pipe(
              tap(() => this.loadingService.toggleLoadingObs(LoadingObsName.CHECKING_EMAIL)),
              debounceTime(400),
              distinctUntilChanged(),
              switchMap(value => this.checkEmailUnique(value)),
              map((unique: boolean) => (unique ? null : {'emailUniquenessViolated': true})),
              finalize(() => this.loadingService.toggleLoadingObs(LoadingObsName.CHECKING_EMAIL)),
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
