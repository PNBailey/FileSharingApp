import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user';
import { HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
    let jwtInterceptor: JwtInterceptor;
    let accountService: AccountService;
    let httpRequest: HttpRequest<unknown>;
    let httpHandler: HttpHandler;
    const loggedOnUser = new User();

    beforeEach(() => {
        httpRequest = new HttpRequest<unknown>('GET', 'http://example.com');
        httpHandler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
        httpHandler.handle = jasmine.createSpy('handle').and.returnValue(of(new HttpResponse))
        loggedOnUser.token = "test";
        accountService = jasmine.createSpyObj<AccountService>('AccountService', ['loggedOnUser$']);
        accountService.loggedOnUser$ = of(null);
        jwtInterceptor = new JwtInterceptor(accountService);
    }); 
    
    it('should add the authorization header to the request when the user is logged in', () => {        
        accountService.loggedOnUser$ = of(loggedOnUser);
        jwtInterceptor.intercept(httpRequest, httpHandler).subscribe(() => {
            expect(jwtInterceptor.newRequest.headers.get('Authorization')).toEqual('Bearer test')
        });
    });
    it('should not add the authorization header to the request when the user not is logged in', () => {        
        jwtInterceptor.intercept(httpRequest, httpHandler).subscribe(() => {
            expect(jwtInterceptor.newRequest.headers.get('Authorization')).toBeNull()
        });
    });
    it('should call the httpHandler handle method', () => {        
        jwtInterceptor.intercept(httpRequest, httpHandler).subscribe(() => {
            expect(httpHandler.handle).toHaveBeenCalledWith(jwtInterceptor.newRequest)
        });
    });
});
