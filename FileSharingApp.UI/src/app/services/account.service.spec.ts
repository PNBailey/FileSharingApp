import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { AccountService } from "./account.service";
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from "../home/home.component";
import { User } from "../models/user";
import { LoginUser } from "../models/loginUser";
import { TestBed } from "@angular/core/testing";

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
    describe('loginOrRegister method', () => {
        it('should send one POST http request and should return a user', () => {
            const user = new User();
            const loginUser = new LoginUser();

            service.loginOrRegister(loginUser, "/Login").subscribe(returnedUser => {
                expect(returnedUser).toEqual(user);
            });
        
            const req = httpMock.expectOne("https://localhost:7249/api/Account/Login");
            expect(req.request.method).toBe("POST");
            req.flush(user);
        });
    }); 
});