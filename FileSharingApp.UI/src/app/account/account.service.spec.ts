import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { of } from "rxjs";
import { LoginUser } from "../models/loginUser";
import { RegisterUser } from "../models/registerUser";
import { User } from "../models/user";
import { AccountService } from "./account.service";

describe('Account Service', () => {
    let service: AccountService;
    let httpMock: HttpTestingController;
    let fb = new FormBuilder();

    const validationService = {
        uniqueUsernameValidatorFn: () => {
            return of({'usernameUniquenessViolated': true});
        },
        uniqueEmailValidatorFn: () => {
            return of({'emailUniquenessViolated': true});
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                MatDialogModule,
                FormsModule,
                ReactiveFormsModule
            ]
        });
        service = TestBed.inject(AccountService);
        httpMock = TestBed.inject(HttpTestingController); 
    });
    describe('accountAccessForm$ observable', () => {
        it('should contain a login form when initialised', () => {
            service.accountAccessForm$.subscribe(accountAccessForm => {
                expect(accountAccessForm.controls['username']).toBeTruthy();
                expect(accountAccessForm.controls['password']).toBeTruthy();
            });
        });
        it('should contain a register form when userIsRegistering is toggled', () => {
            service.toggleUserIsRegistering();
            service.accountAccessForm$.subscribe(accountAccessForm => {
                expect(accountAccessForm.controls['username']).toBeTruthy();
                expect(accountAccessForm.controls['password']).toBeTruthy();
                expect(accountAccessForm.controls['email']).toBeTruthy();
            });
        });
    });
    describe('accountAction$ observable', () => {
        it('should contain the correct values when initialised', () => {
            service.accountAction$.subscribe(accountAction => {
                expect(accountAction.type).toEqual('Login');
                expect(accountAction.linkLabel).toEqual('No account?');
                expect(accountAction.linkText).toEqual('Register');
                expect(accountAction.buttonAction).toEqual('Login');
            });
        });
        it('should contain the correct values when userIsRegistering is toggled', () => {
            service.toggleUserIsRegistering();
            service.accountAction$.subscribe(accountAction => {
                expect(accountAction.type).toEqual('Register');
                expect(accountAction.linkLabel).toEqual('Already have an account?');
                expect(accountAction.linkText).toEqual('Login');
                expect(accountAction.buttonAction).toEqual('Register');
            });
        });
    });
    describe('onAccountAccessFormSubmitted method', () => {
        it('should trigger loginOrRegister method', () => {

            service.loginOrRegister = jasmine.createSpy('service-loginOrRegister-method').and.returnValue(of(null));

            const registerUser = new RegisterUser();
            registerUser.email = "testEmail@gmail.com";
            registerUser.password = "Pa$$w0rd";
            registerUser.username = "test";

            service.toggleUserIsRegistering();
            service.onAccountAccessFormSubmitted(registerUser);

            expect(service.loginOrRegister).toHaveBeenCalled();
        });
    });
    describe('userIsRegistering$ observable', () => {
        it('should have false value when service is initialised', () => {
            expect(service.getUserIsRegisteringValue()).toBeFalsy();
        });
        it('should have true value when value is toggled', () => {
            service.toggleUserIsRegistering();
            expect(service.getUserIsRegisteringValue()).toBeTruthy();
        });
    });
    describe('loginOrRegister method', () => {
        it('should create login url when logging in', () => {
            const registerUser = new RegisterUser();
            registerUser.email = 'testEmail@gmail.com';
            registerUser.password = 'Pa$$w0rd';
            registerUser.username = 'test';

            service.loginOrRegister(registerUser).subscribe();
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            expect(req.request.url).toEqual("https://localhost:7249/api/Account/Login");
        });
        it('should create register url when logging in', () => {
            const registerUser = new RegisterUser();
            registerUser.email = 'testEmail@gmail.com';
            registerUser.password = 'Pa$$w0rd';
            registerUser.username = 'test';

            service.toggleUserIsRegistering();
            service.loginOrRegister(registerUser).subscribe();
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Register");
            expect(req.request.url).toEqual("https://localhost:7249/api/Account/Register");
        });
        it('should send one POST http request and should return a user', () => {
            const user = new User();
            user.id = 1;
            user.token = 'FakeToken';
            user.username = 'test';

            const loginUser = new LoginUser();
            loginUser.password = 'Pa$$w0rd';
            loginUser.username = 'test';

            service.loginOrRegister(loginUser).subscribe(returnedUser => {
                expect(returnedUser).toEqual(user);
            });
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            expect(req.request.method).toBe("POST");
            req.flush(user);
        });
        it('should call setLoggedOnUser method', () => {
            const user = new User();
            user.id = 1;
            user.token = 'FakeToken';
            user.username = 'test';

            const loginUser = new LoginUser();
            loginUser.password = 'Pa$$w0rd';
            loginUser.username = 'test';
            
            service.setLoggedOnUser = jasmine.createSpy('service-setLoggedOnUser-method');

            service.loginOrRegister(loginUser).subscribe(() => {
                expect(service.setLoggedOnUser).toHaveBeenCalled();
            });
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            req.flush(user);
        });
        it('should call dialog.closeAll method', () => {
            const user = new User();
            user.id = 1;
            user.token = 'FakeToken';
            user.username = 'test';

            const loginUser = new LoginUser();
            loginUser.password = 'Pa$$w0rd';
            loginUser.username = 'test';
            
            service.dialog.closeAll = jasmine.createSpy('dialog-closeAll-method');

            service.loginOrRegister(loginUser).subscribe(() => {
                expect(service.dialog.closeAll).toHaveBeenCalled();
            });
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            req.flush(user);
        });
        it('should call the router.navigate method with the route to the home page', () => {
            const user = new User();
            user.id = 1;
            user.token = 'FakeToken';
            user.username = 'test';

            const loginUser = new LoginUser();
            loginUser.password = 'Pa$$w0rd';
            loginUser.username = 'test';
            
            service['router'].navigate = jasmine.createSpy('service-navigate-method');

            service.loginOrRegister(loginUser).subscribe(() => {
                expect(service['router'].navigate).toHaveBeenCalledWith(['/home']);
            });
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            req.flush(user);
        });
    }); 
    describe('logout method', () => {
        it('should call the setLoggedOnUser method with a null value', () => {
            service.setLoggedOnUser = jasmine.createSpy('service-setLoggedOnUser-method');
            service.logout();
            expect(service.setLoggedOnUser).toHaveBeenCalledWith(null);
        });
    });
    describe('setLoggedOnUser method', () => {
        it('should call the local storage setItem method with the correct arguments', () => {
            window.localStorage.setItem = jasmine.createSpy('window.localStorage.setItem-method');

            const user = new User();
            user.id = 1;
            user.token = 'FakeToken';
            user.username = 'test';

            service.setLoggedOnUser(user);

            expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
        });
        it('should set the value of the loggedOnUser behavior subject', () => {
            const user = new User();
            user.id = 1;
            user.token = 'FakeToken';
            user.username = 'test';

            service.setLoggedOnUser(user);

            service.loggedOnUser$.subscribe(loggedOnUser => {
                expect(loggedOnUser).toEqual(user);
            });
        });
    });
});