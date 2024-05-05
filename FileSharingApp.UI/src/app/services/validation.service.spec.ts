import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
    let service: ValidationService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(ValidationService);
        httpMock = TestBed.inject(HttpTestingController); 
    });
    describe('checkUsernameUnique method', () => {
        it('should call http get with correct url', () => {
            service.checkUsernameUnique('test').subscribe();
            const req = httpMock.expectOne("https://localhost:7249/api/Account/CheckUsername?username=test");
            expect(req.request.method).toEqual("GET");
        });
    });
    describe('checkEmailUnique method', () => {
        it('should call http get with correct url', () => {
            service.checkEmailUnique('test').subscribe();
            const req = httpMock.expectOne("https://localhost:7249/api/Account/CheckEmail?email=test");
            expect(req.request.method).toEqual("GET");
        });
    });
});
