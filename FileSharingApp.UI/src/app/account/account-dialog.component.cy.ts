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
    const elementBindings = {
        submitButton: '[data-cy="submit-btn"]',
        loginRegisterLink: '[data-cy="login-register-link"]',
        accountFormControls: '[data-cy="account-form-control"]',
        linkLabel: '[data-cy="link-label"]',
        usernameInput: '[data-cy="username-input"]',
        passwordInput: '[data-cy="password-input"]',
        emailInput: '[data-cy="email-input"]',
    }

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
        cy.get(elementBindings.loginRegisterLink).click();
        cy.get(elementBindings.submitButton).should('have.text', 'Register');
    });

    it("form submit button text should be 'Login' when user is logging in", () => {
        cy.get(elementBindings.submitButton).should('have.text', 'Login');
    });

    it('form should contain 3 form controls when user is registering', () => {
        cy.get(elementBindings.loginRegisterLink).click();
        cy.get(elementBindings.accountFormControls).should('have.length', 3);
    });

    it('form should contain 2 form controls when user is logging in', () => {
        cy.get(elementBindings.accountFormControls).should('have.length', 2);
    });

    it("form link text should contain correct text when user is logging in", () => {
        cy.get(elementBindings.loginRegisterLink).should('have.text', 'Register ');
    });

    it("form link text should contain correct text when user is registering", () => {
        cy.get(elementBindings.loginRegisterLink).click();
        cy.get(elementBindings.loginRegisterLink).should('have.text', 'Login ');
    });

    it("form link label should contain correct text when user is logging in", () => {
        cy.get(elementBindings.linkLabel).should('have.text', 'No account? Register ');
    });

    it("form link label should contain correct text when user is registering", () => {
        cy.get(elementBindings.loginRegisterLink).click();
        cy.get(elementBindings.linkLabel).should('have.text', 'Already have an account? Login ');
    });

    it('form should have username already exists error when user already exists validator returns true', () => {
        //Arrange
        cy.get(elementBindings.usernameInput).type('test name');
        cy.get(elementBindings.submitButton).focus();

        //Assert
        cy.contains('No user found with this username. Select register below');
    });

    it('form should have email does not exist error when user not found by email validator returns true', () => {
        //Arrange
        cy.get(elementBindings.loginRegisterLink).click();
        cy.get(elementBindings.emailInput).type('testEmail@email.com');
        cy.get(elementBindings.submitButton).focus();

        //Assert
        cy.contains('An account with this email address already exists. Select login below to login');
    });
});
    
