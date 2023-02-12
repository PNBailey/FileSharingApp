import { Observable, of } from "rxjs";

export interface MockValidationService {
    uniqueUsernameValidatorFn(): Observable<{'usernameUniquenessViolated': true}>;
    uniqueEmailValidatorFn(): Observable<{'emailUniquenessViolated': true}>;
}

export function getValidationServiceMock() {
    
    const mockValidationService: MockValidationService = {
        uniqueUsernameValidatorFn: () => {
            return of({'usernameUniquenessViolated': true});
        },
        uniqueEmailValidatorFn: () => {
            return of({'emailUniquenessViolated': true});
        }
    }

    return mockValidationService;

}