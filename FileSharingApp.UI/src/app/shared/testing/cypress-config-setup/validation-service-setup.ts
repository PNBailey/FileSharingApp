import { AsyncValidatorFn } from "@angular/forms";
import { Observable, of } from "rxjs";

export interface MockValidationService {
    uniqueUsernameValidatorFn(): AsyncValidatorFn;
    uniqueEmailValidatorFn(): AsyncValidatorFn;
    checkUsernameUnique(): Observable<boolean>;
    checkEmailUnique(): Observable<boolean>;
}

export function getValidationServiceMock() {

    const mockValidationService: MockValidationService = {
        uniqueUsernameValidatorFn: () => () => of({ 'usernameUniquenessViolated': true }),
        uniqueEmailValidatorFn: () => () => of({ 'emailUniquenessViolated': true }),
        checkUsernameUnique: () => of(true),
        checkEmailUnique: () => of(true)
    }
    return mockValidationService;
    
}