/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from '../models/snackbar-item';
import { MessageHandlingService } from './message-handling.service';
import { Router } from '@angular/router';


export enum Exception {
    VALIDATION_EXCEPTION = "ValidationException",
    SIGN_IN_EXCEPTION = "SignInException",
    USER_NOT_FOUND_EXCEPTION = "UserNotFoundException"
}

export enum ExceptionMessage {
    VALIDATION_EXCEPTION_MESSAGE = "Unable to submit. There are errors on the form",
    SIGN_IN_EXCEPTION_MESSAGE = "Password is incorrect",
    USER_NOT_FOUND_EXCEPTION_MESSAGE = "No user found with that username",
    DEFAULT_RESOURCE_NOT_FOUND_MESSAGE = "Resource not found"
}

export enum ErrorCode {
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404
}
@Injectable({
    providedIn: 'root'
})
export class ErrorHandlingService implements ErrorHandler {

    error: any;
    message = "";
    baseUrl = "https://localhost:7249/api/Errors";

    constructor(
        private messageHandlingService: MessageHandlingService,
        private http: HttpClient,
        private ngZone: NgZone,
        private router: Router
    ) { }

    handleError(error: any) {
        this.error = error;
        this.setDefaultErrorMessage();
        this.setCustomErrorMessage();
        this.logError();
        this.displayErrorToUser();
    }

    private setDefaultErrorMessage() {
        this.error.error ?
            this.message = this.error.error.title :
            this.message = this.error.message;
    }

    private setCustomErrorMessage() {
        switch (this.error.status) {
            case ErrorCode.Unauthorized:
                this.handle401Error();
                break;
            case ErrorCode.Forbidden:
                this.handle403Error();
                break;
            case ErrorCode.NotFound:
                this.handle404Error();
                break;
            default:
                this.message = "An unexpected error occured: " + this.message;
                break;
        }
    }

    private handle401Error() {
        switch (this.error.error?.type) {
            case Exception.SIGN_IN_EXCEPTION:
                this.message = ExceptionMessage.SIGN_IN_EXCEPTION_MESSAGE;
                break;
        }
    }

    private handle403Error() {
        switch (this.error.error?.type) {
            case Exception.VALIDATION_EXCEPTION:
                this.message = ExceptionMessage.VALIDATION_EXCEPTION_MESSAGE;
                break;
        }
    }

    private handle404Error() {
        switch (this.error.error?.type) {
            case Exception.USER_NOT_FOUND_EXCEPTION:
                this.message = ExceptionMessage.USER_NOT_FOUND_EXCEPTION_MESSAGE;
                break;
            default:
                this.message = ExceptionMessage.DEFAULT_RESOURCE_NOT_FOUND_MESSAGE;
        }
    }

    private logError() {
        this.http.post(`${this.baseUrl}/LogError?message=${this.message}`, {}).subscribe();
    }

    private displayErrorToUser() {
        if (this.message != "Session Expired") {

        }
        this.messageHandlingService.onDisplayNewMessage({
            message: this.message,
            action: SnackbarAction.Close,
            classType: SnackbarClassType.Error,
            duration: SnackbarDuration.Medium
        });
    }
}
