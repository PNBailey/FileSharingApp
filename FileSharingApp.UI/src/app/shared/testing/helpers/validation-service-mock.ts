import { of } from "rxjs";
import { ValidationService } from "src/app/services/validation.service";

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