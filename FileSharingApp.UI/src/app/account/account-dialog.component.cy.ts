import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder, UntypedFormGroup, Validators, FormControl, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BehaviorSubject, of, map } from "rxjs";
import { AngularMaterialModule } from "../shared/angular-material.module";
import { AccountDialogComponent } from "./account-dialog.component";
import { AccountService } from "./account.service";

describe('AccountDialogComponent', () => {

    const fb: FormBuilder = new FormBuilder();
    const userIsRegistering: BehaviorSubject<boolean> = new BehaviorSubject(false);
    const userIsRegistering$ = userIsRegistering.asObservable();

    const validationService = {
        uniqueUsernameValidatorFn: () => {
            return of({'usernameUniquenessViolated': true});
        },
        uniqueEmailValidatorFn: () => {
            return of({'emailUniquenessViolated': true});
        }
    }

    const accountAccessForm$ = userIsRegistering$.pipe(
        map((userIsRegistering) => {
            const form: UntypedFormGroup = fb.group({
            'username': ['', [Validators.required], [validationService.uniqueUsernameValidatorFn]],
            'password': ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]]
            });
            if(userIsRegistering) {
                form.addControl('email', new FormControl('', [Validators.required, Validators.email], [validationService.uniqueEmailValidatorFn]));
            } 
            return form;
        })
    )

    const accountService = {
        userIsRegistering$: userIsRegistering$,
        accountAccessForm$: accountAccessForm$,
        accountAction$: userIsRegistering$.pipe(
            map(userIsRegistering => {
                return {
                    type: userIsRegistering ? 'Register' : 'Login',
                    linkLabel: userIsRegistering ? 'Already have an account?' : 'No account?',
                    linkText: userIsRegistering ? 'Login' : 'Register',
                    buttonAction: userIsRegistering ? 'Register' : 'Login',
                }
            })
        ),
        toggleUserIsRegistering: () => {
            userIsRegistering.next(!userIsRegistering.getValue());
        }
    };

    it('mounts', () => {
        cy.mount(AccountDialogComponent, {
            imports: [ 
                HttpClientTestingModule, 
                ReactiveFormsModule,
                AngularMaterialModule,
                BrowserAnimationsModule
            ],
            declarations: [ AccountDialogComponent ],
            providers: [{provide: AccountService, useValue: accountService}]
        })
    });

    beforeEach(() => {
        cy.mount(AccountDialogComponent, {
            imports: [ 
                HttpClientTestingModule, 
                ReactiveFormsModule,
                AngularMaterialModule,
                BrowserAnimationsModule
            ],
            declarations: [ AccountDialogComponent ],
            providers: [{provide: AccountService, useValue: accountService}]
        })
        userIsRegistering.next(false);
    });

    it("form submit button text should be 'Register' when user is registering", () => {
        cy.get('[data-cy="login-register-link"]').click();
        cy.get('[data-cy="submit-btn"]').should('have.text', 'Register');
    });

    it("form submit button text should be 'Login' when user is logging in", () => {
        cy.get('[data-cy="submit-btn"]').should('have.text', 'Login');
    });

    it('form should contain 3 form controls when user is registering', () => {
        cy.get('[data-cy="login-register-link"]').click();
        cy.get('[data-cy="account-form-control"]').should('have.length', 3);
    });

    it('form should contain 2 form controls when user is logging in', () => {
        cy.get('[data-cy="account-form-control"]').should('have.length', 2);
    });

    it("link text should contain correct text when user is logging in", () => {
        cy.get('[data-cy="login-register-link"]').should('have.text', 'Register ');
    });

    it("link text should contain correct text when user is registering", () => {
        cy.get('[data-cy="login-register-link"]').click();
        cy.get('[data-cy="login-register-link"]').should('have.text', 'Login ');
    });
});
    
