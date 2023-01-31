import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { fakeAsync, flush, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { of, skip } from "rxjs";
import { AccountService } from "./account.service";
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from "../home/home.component";

describe('Account Service', () => {
    let service: AccountService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                MatDialogModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'home', component: HomeComponent}
                ])
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
            service.accountAccessForm$.pipe(skip(1))
                .subscribe(accountAccessForm => {
                    expect(accountAccessForm.controls['username']).toBeTruthy();
                    expect(accountAccessForm.controls['password']).toBeTruthy();
                    expect(accountAccessForm.controls['email']).toBeTruthy();
                });
            service.toggleUserIsRegistering();
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
            service.accountAction$.pipe(skip(1))
            .subscribe(accountAction => {
                expect(accountAction.type).toEqual('Register');
                expect(accountAction.linkLabel).toEqual('Already have an account?');
                expect(accountAction.linkText).toEqual('Login');
                expect(accountAction.buttonAction).toEqual('Register');
            });
            service.toggleUserIsRegistering();
        });
    });
    describe('onAccountAccessFormSubmitted method', () => {
        it('should call the loginOrRegister method with the correct URL when the user is logging in', () => {
            const loginUser = new TestLoginUser();

            service['loginOrRegister'] = jasmine.createSpy('service-loginOrRegister-method').and.returnValue(of(null));

            service.onAccountAccessFormSubmitted(loginUser);

            expect(service['loginOrRegister']).toHaveBeenCalledWith(loginUser, "https://localhost:7249/api/Account/Login");
        });
        it('should call the loginOrRegister method with the correct URL when the user is registering', () => {
            const registerUser = new TestRegisterUser();

            service.toggleUserIsRegistering();

            service['loginOrRegister'] = jasmine.createSpy('service-loginOrRegister-method').and.returnValue(of(null));

            service.onAccountAccessFormSubmitted(registerUser);

            expect(service['loginOrRegister']).toHaveBeenCalledWith(registerUser, "https://localhost:7249/api/Account/Register");
        });
    });
    describe('userIsRegistering$ observable', () => {
        it('should have false value when service is initialised', () => {
            service.userIsRegistering$.subscribe(value => {
                expect(value).toEqual(false);
            });
        });
        it('should contain true value when value is toggled', () => {
            service.userIsRegistering$.pipe(skip(1))
            .subscribe(value => {
                expect(value).toEqual(true);
            });
            service.toggleUserIsRegistering();
        });
    });
    describe('loginRegisterUrl$ observable', () => {
        it('should contain the register url when user is registering', () => {
            service['loginRegisterUrl$'].pipe(skip(1))
            .subscribe((loginRegisterUrl) => {
                expect(loginRegisterUrl).toEqual("https://localhost:7249/api/Account/Register");
            });
            service.toggleUserIsRegistering();
        });
        it('should contain the login url when user is logging in', () => {
            service['loginRegisterUrl$']
            .subscribe((loginRegisterUrl) => {
                expect(loginRegisterUrl).toEqual("https://localhost:7249/api/Account/Login");
            });
        });
    });
    describe('loginOrRegister method', () => {
        it('should send one POST http request and should return a user', () => {
            const user = new TestUser();
            const loginUser = new TestLoginUser();

            service['loginOrRegister'](loginUser, "https://localhost:7249/api/Account/Login").subscribe(returnedUser => {
                expect(returnedUser).toEqual(user);
            });
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            expect(req.request.method).toBe("POST");
            req.flush(user);
        });
        it('should call setLoggedOnUser method', () => {
            const user = new TestUser();
            const loginUser = new TestLoginUser();
            
            service.setLoggedOnUser = jasmine.createSpy('service-setLoggedOnUser-method');

            service['loginOrRegister'](loginUser, "https://localhost:7249/api/Account/Login").subscribe(() => {
                expect(service.setLoggedOnUser).toHaveBeenCalled();
            });
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            req.flush(user);
        });
        it('should call dialog.closeAll method', () => {
            const user = new TestUser();
            const loginUser = new TestLoginUser();

            service.dialog.closeAll = jasmine.createSpy('dialog-closeAll-method');

            service['loginOrRegister'](loginUser, "https://localhost:7249/api/Account/Login").subscribe(() => {
                expect(service.dialog.closeAll).toHaveBeenCalled();
            });
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            req.flush(user);
        });
        it('should call the router.navigate method with the route to the home page', () => {
            const user = new TestUser();
            const loginUser = new TestLoginUser();
            
            service['router'].navigate = jasmine.createSpy('service-navigate-method');

            service['loginOrRegister'](loginUser, "https://localhost:7249/api/Account/Login").subscribe(() => {
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

            const user = new TestUser();

            service.setLoggedOnUser(user);

            expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
        });
        it('should set the value of the loggedOnUser behavior subject', () => {
            const user = new TestUser();

            service.setLoggedOnUser(user);

            service.loggedOnUser$.subscribe(loggedOnUser => {
                expect(loggedOnUser).toEqual(user);
            });
        });
    });
});

export class TestUser {
    id: 1;
    token: 'FakeToken';
    username: 'test';
}

export class TestLoginUser {
    password: 'Pa$$w0rd';
    username:'test';
}

export class TestRegisterUser {
    password: 'Pa$$w0rd';
    username: 'test';
    email:'testEmail@gmail.com';
}