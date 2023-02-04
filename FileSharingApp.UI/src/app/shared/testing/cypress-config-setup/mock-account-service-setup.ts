import { FormBuilder, UntypedFormGroup, Validators, FormControl } from "@angular/forms";
import { Subject, Observable, scan, startWith, of, map } from "rxjs";
import { TestUser } from "../models/testUser";

export function getMockAccountService() {

    const fb = new FormBuilder();
    
    const mockToggleUserIsRegistering = new Subject<void>();
    const mockUserIsRegistering$: Observable<boolean> = mockToggleUserIsRegistering.pipe(
        scan(previous => !previous, false),
        startWith(false)
    );
    
    const mockLoggedOnUser$: Observable<TestUser | null> = of(new TestUser());
    const mockValidationService = {
        uniqueUsernameValidatorFn: () => {
            return of({'usernameUniquenessViolated': true});
        },
        uniqueEmailValidatorFn: () => {
            return of({'emailUniquenessViolated': true});
        }
    }
    
    const mockaccountAccessForm$ = mockUserIsRegistering$.pipe(
        map((mockUserIsRegistering) => {
            const form: UntypedFormGroup = fb.group({
            'username': ['', [Validators.required], [mockValidationService.uniqueUsernameValidatorFn]],
            'password': ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]]
            });
            if(mockUserIsRegistering) {
                form.addControl('email', new FormControl('', [Validators.required, Validators.email], [mockValidationService.uniqueEmailValidatorFn]));
            } 
            return form;
        })
    )
    
    const mockAccountService = {
        loggedOnUser$: mockLoggedOnUser$,
        logout: () => {
            return null;
        },
        userIsRegistering$: mockUserIsRegistering$,
        accountAccessForm$: mockaccountAccessForm$,
        accountAction$: mockUserIsRegistering$.pipe(
            map(mockUserIsRegistering => {
                return {
                    type: mockUserIsRegistering ? 'Register' : 'Login',
                    linkLabel: mockUserIsRegistering ? 'Already have an account?' : 'No account?',
                    linkText: mockUserIsRegistering ? 'Login' : 'Register',
                    buttonAction: mockUserIsRegistering ? 'Register' : 'Login',
                }
            })
        )
    }
    return mockAccountService;
}