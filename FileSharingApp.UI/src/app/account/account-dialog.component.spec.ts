import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { AccountDialogComponent } from './account-dialog.component';
import { ValidationService } from '../services/validation.service';
import { AccountDialogActions } from '../state/account/account.actions';
import { getValidationServiceMock } from '../shared/testing/helpers/validation-service-mock';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatErrorHarness, MatFormFieldHarness } from '@angular/material/form-field/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { ChangeDetectionStrategy } from '@angular/core';


describe('AccountDialogComponent', () => {

    let store: MockStore;
    let component: AccountDialogComponent;
    let fixture: ComponentFixture<AccountDialogComponent>;
    let loader: HarnessLoader;
    const initialState = { loggedOnUser: null };
    const mockValidationService = getValidationServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AccountDialogComponent,
                BrowserAnimationsModule,
                MatDialogModule
            ],
            providers: [
                provideMockStore({ initialState }),
                { provide: ValidationService, useValue: mockValidationService },
            ],
        })
            .overrideComponent(AccountDialogComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default }
            });

        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(AccountDialogComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    it('mounts', () => {
        expect(component).toBeDefined();
    });

    describe('form', () => {
        it('should contain 3 form controls when user is registering', async () => {
            fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
            fixture.detectChanges();
            expect((await loader.getAllHarnesses(MatFormFieldHarness)).length).toEqual(3);
        });

        it('should contain 2 form controls when user is logging in', async () => {
            expect((await loader.getAllHarnesses(MatFormFieldHarness)).length).toEqual(2);
        });

        it('should contain no errors when it first initializes', async () => {
            expect((await loader.getAllHarnesses(MatErrorHarness)).length).toEqual(0);
        });

        describe('title', () => {
            it('should be "Register" when registering', async () => {
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                fixture.detectChanges();
                const title = fixture.debugElement.query(By.css('.title')).nativeElement;
                expect(title.textContent).toContain('Register');
            });

            it('should be "Login" when logging in', () => {
                const title = fixture.debugElement.query(By.css('.title')).nativeElement;
                expect(title.textContent).toContain('Login');
            });
        });

        describe('submit button', () => {

            let submitButton: MatButtonHarness;

            beforeEach( async () => {
                submitButton = await loader.getHarness(MatButtonHarness.with({ selector: '.submit-btn' }));
            });

            it('text should be "Register" when user is registering', async () => {
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                fixture.detectChanges();
                const btnText = await (submitButton).getText();
                expect(btnText).toContain('Register');
            });

            it('text should be "Login" when user is logging in', async() => {
                const btnText = await (submitButton).getText();
                expect(btnText).toContain('Login');
            });

            it('should be disabled when form is invalid', async () => {
                const isDisabled = await submitButton.isDisabled();
                expect(isDisabled).toBeTruthy();
            });

            it('should be enabled when form is valid', async () => {
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                await (await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }))).setValue('kaka');
                await (await loader.getHarness(MatInputHarness.with({ selector: '.password-input' }))).setValue('Pa$$w0rd');
                await (await loader.getHarness(MatInputHarness.with({ selector: '.email-input' }))).setValue('52pbailey@gmail.com');
                expect(await submitButton.isDisabled()).toBeFalsy();
            });

            it('when clicked, should dispatch a loginOrRegister ngrx action containing a user object and a register url when user is registering', async () => {
                spyOn(store, 'dispatch');
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                await (await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }))).setValue('kaka');
                await (await loader.getHarness(MatInputHarness.with({ selector: '.password-input' }))).setValue('Pa$$w0rd');
                await (await loader.getHarness(MatInputHarness.with({ selector: '.email-input' }))).setValue('52pbailey@gmail.com');
                await submitButton.click();
                expect(store.dispatch).toHaveBeenCalledWith(
                    AccountDialogActions.loginOrRegister({
                        user: {
                            username: 'kaka',
                            password: 'Pa$$w0rd',
                            email: '52pbailey@gmail.com',
                        },
                        url: '/Register',
                    })
                );
            });

            it('when clicked, should dispatch a loginOrRegister ngrx action containing a user object and a login url when user is logging in', async () => {
                spyOn(store, 'dispatch');
                await (await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }))).setValue('kaka');
                await (await loader.getHarness(MatInputHarness.with({ selector: '.password-input' }))).setValue('Pa$$w0rd');
                await submitButton.click();
                expect(store.dispatch).toHaveBeenCalledWith(
                    AccountDialogActions.loginOrRegister({
                        user: {
                            username: 'kaka',
                            password: 'Pa$$w0rd'
                        },
                        url: '/Login',
                    })
                );
            });
        });

        describe('link text', () => {
            it('should contain correct text when user is logging in', () => {
                expect(fixture.debugElement.query(By.css('.login-register-link')).nativeElement.textContent).toContain('Register');
            });

            it('should contain correct text when user is registering', () => {
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('.login-register-link')).nativeElement.textContent).toContain('Login');
            });
        });

        describe('link label', () => {
            it('should contain correct text when user is logging in', () => {
                expect(fixture.debugElement.query(By.css('.link-label')).nativeElement.textContent).toContain('No account? Register ');
            });

            it('should contain correct text when user is registering', () => {
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                expect(fixture.debugElement.query(By.css('.link-label')).nativeElement.textContent).toContain('No account? Register ');
            });
        });

        describe('username form control', () => {
            let usernameInput: MatInputHarness;
            beforeEach(async () => {
                usernameInput = await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }));
            });

            it('should have username taken error when user already exists validator returns true and user is registering', async () => {
                returnUniquenessValidationErrors();
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                await usernameInput.setValue('testing');
                fixture.detectChanges();
                await (await loader.getHarness(MatButtonHarness.with({ selector: '.cancel-btn' }))).focus();
                fixture.detectChanges();
                expect(await loader.getHarness(MatErrorHarness.with({ selector: '.username-custom-validator-username-taken' }))).toBeTruthy();
                resetUniquenessValidationErrors();
            });
        });

        describe('email form control', () => {

            it('should have email required error when no email provided', async () => {
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                (await loader.getHarness(MatInputHarness.with({ selector: '.email-input' }))).focus();
                (await loader.getHarness(MatButtonHarness.with({ selector: '.cancel-btn' }))).focus();
                expect(await loader.getHarness(MatErrorHarness.with({ selector: '.email-required-error' }))).toBeTruthy();
            });

            it('should have invalid email error when email is invalid', async () => {
                fixture.debugElement.query(By.css('.login-register-link')).nativeElement.click();
                (await loader.getHarness(MatInputHarness.with({ selector: '.email-input' }))).setValue('Invalid Email');
                (await loader.getHarness(MatButtonHarness.with({ selector: '.cancel-btn' }))).focus();
                expect(await loader.getHarness(MatErrorHarness.with({ selector: '.email-invalid-error' }))).toBeTruthy();
            });
        });

        describe('password form cotrol', () => {
            it('should have password required error when no password provided', async () => {
                (await loader.getHarness(MatInputHarness.with({ selector: '.password-input' }))).setValue("");
                (await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }))).focus();
                fixture.detectChanges();
                expect(await loader.getHarness(MatErrorHarness.with({ selector: '.password-required-error' }))).toBeTruthy();
            });

            it('should have password pattern invalid error when password format is invalid', async () => {
                (await loader.getHarness(MatInputHarness.with({ selector: '.password-input' }))).setValue('pass');
                (await loader.getHarness(MatButtonHarness.with({ selector: '.cancel-btn' }))).focus();
                expect(await loader.getHarness(MatErrorHarness.with({ selector: '.password-invalid-error' }))).toBeTruthy();
            });
        });
    });
    const returnUniquenessValidationErrors = () => {
        mockValidationService.uniqueEmailValidatorFn = jasmine.createSpy('uniqueEmailValidatorFn').and.returnValue(() => of({ 'emailUniquenessViolated': true }));
        mockValidationService.uniqueUsernameValidatorFn = jasmine.createSpy('uniqueUsernameValidatorFn').and.returnValue(() => of({ 'usernameUniquenessViolated': true }));
    };

    const resetUniquenessValidationErrors = () => {
        mockValidationService.uniqueEmailValidatorFn = jasmine.createSpy('uniqueEmailValidatorFn').and.returnValue(() => of(null));
        mockValidationService.uniqueUsernameValidatorFn = jasmine.createSpy('uniqueUsernameValidatorFn').and.returnValue(() => of(null));
    };
});