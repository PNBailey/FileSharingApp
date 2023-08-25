import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from "../models/snackbar-item";
import { ErrorCode, ErrorHandlingService, Exception, ExceptionMessage} from "./error-handling.service";
import { MessageHandlingService } from "./message-handling.service";

describe('ErrorHandlingService', () => {
    let service: ErrorHandlingService;
    const messageHandlingService = jasmine.createSpyObj('MessageHandlingService', ['onDisplayNewMessage']);
    let httpMock: HttpTestingController;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule, HttpClientTestingModule],
            providers: [
                {provide: MessageHandlingService, useValue: messageHandlingService}
            ]
        });
        service = TestBed.inject(ErrorHandlingService);
        httpMock = TestBed.inject(HttpTestingController);
    });
    
    it('should set the custom error message for 401 Unauthorized', () => {
        service.error = {status: ErrorCode.Unauthorized, error: { type: Exception.SIGN_IN_EXCEPTION }};
        service['setCustomErrorMessage']();
        expect(service.message).toEqual(ExceptionMessage.SIGN_IN_EXCEPTION_MESSAGE);
    });
  
    it('should set the custom error message for 403 Forbidden', () => {
        service.error = {status: ErrorCode.Forbidden, error: { type: Exception.VALIDATION_EXCEPTION }};
        service['setCustomErrorMessage']();
        expect(service.message).toEqual(ExceptionMessage.VALIDATION_EXCEPTION_MESSAGE);
    });
  
    it('should set the custom error message for 404 NotFound', () => {
        service.error = { status: ErrorCode.NotFound, error: { type: Exception.USER_NOT_FOUND_EXCEPTION } };
        service['setCustomErrorMessage']();
        expect(service.message).toEqual(ExceptionMessage.USER_NOT_FOUND_EXCEPTION_MESSAGE);
    });
  
    it('should set the default error message', () => {
        service.error = { status: 500, message: 'An unexpected error occured: unexpected error' };
        service['setDefaultErrorMessage']();
        expect(service.message).toEqual('An unexpected error occured: unexpected error');
    });
  
    it('should log the error to the back end', () => {
        service.message = 'error message';
        service['logError']();
        const req = httpMock.expectOne(`https://localhost:7249/api/Errors/LogError?message=error message`);
        expect(req.request.method).toEqual('POST');
    });
  
    it('should display the error to the user', () => {
        service.message = 'error message';
        service['displayErrorToUser']();
        expect(messageHandlingService.onDisplayNewMessage).toHaveBeenCalledWith({
            message: 'error message',
            action: SnackbarAction.Close,
            classType: SnackbarClassType.Error,
            duration: SnackbarDuration.Medium
        });
    });

    it('handleError method should call correct private methods in the ErrorService', () => {
        service['setDefaultErrorMessage'] = jasmine.createSpy();
        service['setCustomErrorMessage'] = jasmine.createSpy();
        service['logError'] = jasmine.createSpy();
        service['displayErrorToUser'] = jasmine.createSpy();

        service.handleError({message: 'error message'});
        
        expect(service['setDefaultErrorMessage']).toHaveBeenCalled();
        expect(service['setCustomErrorMessage']).toHaveBeenCalled();
        expect(service['logError']).toHaveBeenCalled();
        expect(service['displayErrorToUser']).toHaveBeenCalled();
    });
});
  