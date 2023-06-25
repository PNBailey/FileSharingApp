import { AsyncValidatorFn } from "@angular/forms";
import { Observable, of } from "rxjs";
import { ValidationService } from "src/app/services/validation.service";

export interface MockValidationService {
    uniqueUsernameValidatorFn(): AsyncValidatorFn;
    uniqueEmailValidatorFn(): AsyncValidatorFn;
    checkUsernameUnique(): Observable<boolean>;
    checkEmailUnique(): Observable<boolean>;
}

export function getValidationServiceMock() {

    return jasmine.createSpyObj<ValidationService>(
        'ValidationService',
        {
            uniqueUsernameValidatorFn: () => of(null),
            uniqueEmailValidatorFn: () => of(null),
            checkUsernameUnique: of(true),
            checkEmailUnique: of(true)
        }
    )
}