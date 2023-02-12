import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from '../models/snackbar-item';
import { MessageHandlingService } from './message-handling.service';

export const VALIDATION_EXCEPTION = "ValidationException";
export const PASSWORD_INCORRECT_EXCEPTION = "PasswordIncorrectException";
export const USER_NOT_FOUND_EXCEPTION = "UserNotFoundException";

export const VALIDATION_EXCEPTION_MESSAGE = "Unable to submit. There are errors on the form";
export const PASSWORD_INCORRECT_EXCEPTION_MESSAGE = "Password is incorrect";
export const USER_NOT_FOUND_EXCEPTION_MESSAGE = "No user found with that username";
export const DEFAULT_RESOURCE_NOT_FOUND_MESSAGE = "Resource not found";

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
  message: string = "";
  baseUrl = "https://localhost:7249/api/Errors";

  constructor(private messageHandlingService: MessageHandlingService, private http: HttpClient) { }

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
      case PASSWORD_INCORRECT_EXCEPTION:
        this.message = PASSWORD_INCORRECT_EXCEPTION_MESSAGE;
        break;
    }
  }

  private handle403Error() {
    switch (this.error.error?.type) {
      case VALIDATION_EXCEPTION:
        this.message = VALIDATION_EXCEPTION_MESSAGE;
        break;
    }
  }

  private handle404Error() {
    switch (this.error.error?.type) {
      case USER_NOT_FOUND_EXCEPTION:
        this.message = USER_NOT_FOUND_EXCEPTION_MESSAGE;
        break;
      default:
        this.message = DEFAULT_RESOURCE_NOT_FOUND_MESSAGE;  
    }
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
