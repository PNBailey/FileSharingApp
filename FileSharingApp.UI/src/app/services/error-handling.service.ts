/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from '../models/snackbar-item';
import { MessageHandlingService } from './message-handling.service';
import { environment } from 'src/environments/environment';
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
        private router: Router
    ) { }

    handleError(error: any) {
        this.error = error;
        this.setDefaultErrorMessage();
        if (environment.production === false) {
            console.error("Error:", this.message, this.error);
        }
        if (this.error.status == ErrorCode.BadRequest) {
            this.displayErrorToUser();
        } else {
            this.logError();
            this.router.navigateByUrl('/error');
        }
    }

    private setDefaultErrorMessage() {
        this.message = this.error.error.detail ?? this.error.error;
    }

    private logError() {
        this.http.post(`${this.baseUrl}/LogError?message=${this.message}`, {}).subscribe();
    }

    private displayErrorToUser() {
        this.messageHandlingService.onDisplayNewMessage({
            message: this.message,
            action: SnackbarAction.Close,
            classType: SnackbarClassType.Error,
            duration: SnackbarDuration.Medium
        });
    }
}
