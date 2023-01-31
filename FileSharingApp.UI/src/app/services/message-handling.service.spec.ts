import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SnackbarAction, SnackbarClassType, SnackbarDuration, SnackBarItem } from "../models/snackbar-item";
import { MessageHandlingService } from "./message-handling.service";

describe('MessageHandlingService', () => {
    let service: MessageHandlingService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule]
        });
        service = TestBed.inject(MessageHandlingService);
    });

    describe('onDisplayNewMessage method', () => {
        it('should set the displayNewMessage subject', () => {

            service['displayNewMessage'].next = jasmine.createSpy('displayNewMessage-subject-next-method');

            const snackBarItem = new SnackBarItem();
            snackBarItem.action = SnackbarAction.Open;
            snackBarItem.classType = SnackbarClassType.Error;
            snackBarItem.duration = SnackbarDuration.Medium;
            snackBarItem.message = 'test';

            service.onDisplayNewMessage(snackBarItem);

            expect(service['displayNewMessage'].next).toHaveBeenCalledWith(snackBarItem);
        });
    });
    describe('displayMessage method', () => {
        it('should call the snackbar open method', () => {

            service['snackbar'].open = jasmine.createSpy('snackbar-open-method');

            const snackBarItem = new SnackBarItem();
            snackBarItem.action = SnackbarAction.Open;
            snackBarItem.classType = SnackbarClassType.Error;
            snackBarItem.duration = SnackbarDuration.Medium;
            snackBarItem.message = 'test';

            service.displayMessage(snackBarItem);

            expect(service['snackbar'].open).toHaveBeenCalledWith(
                snackBarItem.message, 
                snackBarItem.action, 
                {
                    panelClass: [snackBarItem.classType],
                    duration: snackBarItem.duration,
                    horizontalPosition: 'end'
                }
            );
        });
    });
    describe('newMessageReceived$ Observable', () => {
        it('should call the displayMessage method', () => {
            service.displayMessage = jasmine.createSpy('service-displayMethod-method');
            const snackBarItem = new SnackBarItem();
            snackBarItem.action = SnackbarAction.Open;
            snackBarItem.classType = SnackbarClassType.Error;
            snackBarItem.duration = SnackbarDuration.Medium;
            snackBarItem.message = 'test';

            service.onDisplayNewMessage(snackBarItem);

            expect(service.displayMessage).toHaveBeenCalledWith(snackBarItem);
        });
    });
});