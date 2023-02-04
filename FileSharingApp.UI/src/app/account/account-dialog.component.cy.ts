import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder, UntypedFormGroup, Validators, FormControl, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BehaviorSubject, of, map } from "rxjs";
import { AngularMaterialModule } from "../shared/angular-material.module";
import { setupCypressConfig } from "../shared/testing/cypress-config-setup/cypress-config-setup";
import { AccountDialogComponent } from "./account-dialog.component";
import { AccountService } from "./account.service";

describe('AccountDialogComponent', () => {

    const fb: FormBuilder = new FormBuilder();
    const userIsRegistering: BehaviorSubject<boolean> = new BehaviorSubject(false);
    const userIsRegistering$ = userIsRegistering.asObservable();
    const elementBindings = {
        submitButton: '[data-cy="submit-btn"]',
        cancelButton: '[data-cy="cancel-btn"]',
        loginRegisterLink: '[data-cy="login-register-link"]',
        accountFormControls: '[data-cy="account-form-control"]',
        linkLabel: '[data-cy="link-label"]',
        usernameInput: '[data-cy="username-input"]',
        passwordInput: '[data-cy="password-input"]',
        emailInput: '[data-cy="email-input"]',
        form: '[data-cy="form"]',
        formError: '[data-cy="form-error"]',
        emailCustomValidator: '[data-cy="email-custom-validator"]',
        customValidatorUserNotFound: '[data-cy="username-custom-validator-no-user-found"]',
        customValidatorUsernameTaken: '[data-cy="username-custom-validator-username-taken"]',
        title: '[data-cy="title"]'
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
        cy.mount(AccountDialogComponent,
        setupCypressConfig<AccountDialogComponent>())
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

    describe('form', () => {
        it('should contain 3 form controls when user is registering', () => {
            cy.get(elementBindings.loginRegisterLink).click();
            cy.get(elementBindings.accountFormControls).should('have.length', 3);
        });
        it('should contain 2 form controls when user is logging in', () => {
            cy.get(elementBindings.accountFormControls).should('have.length', 2);
        });     
        it('should contain no errors when it first initializes', () => {
            cy.get(elementBindings.formError).should('have.length', 0);
        });
        describe('title', () => {
            it('should be Register when registering', () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.title).contains('Register');
            }); 
            it('should be Login when logging in', () => {
                cy.get(elementBindings.title).contains('Login');
            }); 
        });
        describe('submit button', () => {
            it("text should be 'Register' when user is registering", () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.submitButton).should('have.text', 'Register');
            });
            it("text should be 'Login' when user is logging in", () => {
                cy.get(elementBindings.submitButton).should('have.text', 'Login');
            });
            it('should be disabled when form is invalid', () => {
                cy.get(elementBindings.cancelButton).focus();
                cy.get(elementBindings.submitButton).should('be.disabled');
            });
            it('should be enabled when form is valid', () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.stub(validationService, 'uniqueEmailValidatorFn').returns(of(null));
                cy.stub(validationService, 'uniqueUsernameValidatorFn').returns(of(null));
                cy.get(elementBindings.usernameInput).type('kaka');
                cy.get(elementBindings.passwordInput).type('Pa$$w0rd');
                cy.get(elementBindings.emailInput).type('52pbailey@gmail.com');
                cy.get(elementBindings.cancelButton).focus();
                cy.get(elementBindings.submitButton).should('be.enabled');
            });
        });
        describe('link text', () => {
            it("should contain correct text when user is logging in", () => {
                cy.get(elementBindings.loginRegisterLink).should('have.text', 'Register ');
            });
        
            it("should contain correct text when user is registering", () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.loginRegisterLink).should('have.text', 'Login ');
            });        
        });    
        describe('link label', () => {
            it("should contain correct text when user is logging in", () => {
                cy.get(elementBindings.linkLabel).should('have.text', 'No account? Register ');
            });
        
            it("should contain correct text when user is registering", () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.linkLabel).should('have.text', 'Already have an account? Login ');
            });        
        });
        describe('username form control', () => {
            it('should have username taken error when user already exists validator returns true and user is registering', () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.usernameInput).type('test name');
                cy.stub(validationService, 'uniqueUsernameValidatorFn').returns(of({'usernameUniquenessViolated': true}));
                cy.get(elementBindings.cancelButton).focus();
                cy.contains('Username is taken');
            });
        
            it('should not have username taken error when user already exists validator returns null and user is registering', () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.usernameInput).type('test name');
                cy.stub(validationService, 'uniqueUsernameValidatorFn').returns(of(null));
                cy.get(elementBindings.cancelButton).focus();
                cy.get(elementBindings.customValidatorUsernameTaken).should('have.length', 0);
            });

            it('should have user not found error when user not found validator returns true and user is logging in', () => {
                cy.get(elementBindings.usernameInput).type('test name');
                cy.stub(validationService, 'uniqueUsernameValidatorFn').returns(of({'usernameUniquenessViolated': true}));
                cy.get(elementBindings.cancelButton).focus();
                cy.contains('No user found with this username. Select register below');
            });

            it('should not have user not found error when user not found validator returns null and user is logging in', () => {
                cy.get(elementBindings.usernameInput).type('test name');
                cy.stub(validationService, 'uniqueUsernameValidatorFn').returns(of({'usernameUniquenessViolated': null}));
                cy.get(elementBindings.cancelButton).focus();
                cy.get(elementBindings.customValidatorUserNotFound).should('have.length', 0);
            });

            it('should have username required error when no username provided', () => {
                cy.get(elementBindings.usernameInput).focus();
                cy.get(elementBindings.cancelButton).focus();
                cy.contains('Username is required');
            });        
        });
        describe('email form control', () => {
            it('should have email already exists error when async email validator returns true', () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.emailInput).type('testEmail@email.com');
                cy.get(elementBindings.cancelButton).focus();
                cy.contains('An account with this email address already exists. Select login below to login');
            });
        
            it('should not have email already exists error when async email validator returns null', () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.stub(validationService, 'uniqueEmailValidatorFn').returns(of(null));
                cy.get(elementBindings.emailInput).type('testEmail@email.com');
                cy.get(elementBindings.cancelButton).focus();
                cy.get(elementBindings.emailCustomValidator).should('have.length', 0);
            });
        
            it('should have email required error when no email provided', () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.emailInput).focus();
                cy.get(elementBindings.cancelButton).focus();
                cy.contains('Email is required');
            });
        
            it('should have invalid email error when email is invalid', () => {
                cy.get(elementBindings.loginRegisterLink).click();
                cy.get(elementBindings.emailInput).type('TestEmailATemailDOTcom');
                cy.get(elementBindings.cancelButton).focus();
                cy.contains('Please enter a valid email');
            });        
        });
        describe('password form cotrol', () => {
            it('should have password required error when no password provided', () => {
                cy.get(elementBindings.passwordInput).focus();
                cy.get(elementBindings.cancelButton).focus();
                cy.contains('Password is required');
            });
        
            it('should have password pattern invalid error when password format is invalid', () => {
                cy.get(elementBindings.passwordInput).type('pass');
                cy.get(elementBindings.cancelButton).focus();
                cy.contains('Password is invalid');
            });        
        });
    });
});