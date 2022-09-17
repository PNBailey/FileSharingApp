import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, map, first, tap, finalize } from "rxjs/operators";
import { AccountService } from "src/app/services/account.service";
import { LoadingService } from "src/app/services/loading.service";

export class UsernameValidator {

static uniqueUsernameValidatorFn(accountService: AccountService, loadingService: LoadingService, loggingIn: boolean): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | {string : boolean} | null> => control.valueChanges
        .pipe(
            tap(() => loadingService.setIsLoading('checkingUsername', true)),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(value => accountService.checkUsernameUnique(value)),
            map((unique: boolean) => ((unique && !loggingIn) || (!unique && loggingIn) ? null : {'usernameUniquenessViolated': true})),
            finalize(() => loadingService.setIsLoading('checkingUsername', false)),
            first()
        );
    }
}