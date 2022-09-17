import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, map, first, finalize, tap } from "rxjs/operators";
import { AccountService } from "src/app/services/account.service";
import { LoadingService } from "src/app/services/loading.service";

export class EmailValidator {

static uniqueEmailValidatorFn(accountService: AccountService, loadingService: LoadingService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | {string : boolean} | null> => control.valueChanges
        .pipe(
            tap(() => loadingService.setIsLoading('checkingEmail', true)),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(value => accountService.checkEmailUnique(value)),
            map((unique: boolean) => (unique ? null : {'emailUniquenessViolated': true})),
            finalize(() => loadingService.setIsLoading('checkingEmail', false)),
            first()
        );
    }
}