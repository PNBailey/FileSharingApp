import { FormBuilder, UntypedFormGroup, Validators, FormControl } from "@angular/forms";
import { Subject, Observable, scan, startWith, map, BehaviorSubject } from "rxjs";
import { User } from "src/app/models/user";
import { MockValidationService } from "./validation-service-setup";

export function getMockAccountService(mockValidationService: MockValidationService) {

    // const fb = new FormBuilder();
    
    // const mockToggleUserIsRegistering = new Subject<void>();
    // const mockUserIsRegistering$: Observable<boolean> = mockToggleUserIsRegistering.pipe(
    //     scan(previous => !previous, false),
    //     startWith(false)
    // );
    
    const mockLoggedOnUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(new User());
    const mockLoggedOnUser$: Observable<null | User> = mockLoggedOnUser.asObservable();
    
    // const mockaccountAccessForm$ = mockUserIsRegistering$.pipe(
    //     map((mockUserIsRegistering) => {
    //         const form: UntypedFormGroup = fb.group({
    //         'username': ['', [Validators.required], [mockValidationService.uniqueUsernameValidatorFn]],
    //         'password': ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]]
    //         });
    //         if(mockUserIsRegistering) {
    //             form.addControl('email', new FormControl('', [Validators.required, Validators.email], [mockValidationService.uniqueEmailValidatorFn]));
    //         } 
    //         return form;
    //     })
    // )
    
    const mockAccountService = {
        loggedOnUser$: mockLoggedOnUser$,
        logout: () => {
            return null;
        },
        // userIsRegistering$: mockUserIsRegistering$,
        // accountAccessForm$: mockaccountAccessForm$,
        // accountAction$: mockUserIsRegistering$.pipe(
        //     map(mockUserIsRegistering => {
        //         return {
        //             type: mockUserIsRegistering ? 'Register' : 'Login',
        //             linkLabel: mockUserIsRegistering ? 'Already have an account?' : 'No account?',
        //             linkText: mockUserIsRegistering ? 'Login' : 'Register',
        //             buttonAction: mockUserIsRegistering ? 'Register' : 'Login',
        //         }
        //     })
        // ),
        // userIsRegisteringToggle: mockToggleUserIsRegistering,
        // toggleUserIsRegistering: () => {
        //     mockToggleUserIsRegistering.next();
        // },
        setLoggedOnUser: () => {
            return null;
        }
    }
    return mockAccountService;
}