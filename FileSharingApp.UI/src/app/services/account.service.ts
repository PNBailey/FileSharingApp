import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from '../models/snackbar-item';
import { User } from '../models/user';
import { LoadingService } from './loading.service';
import { MessageHandlingService } from './message-handling.service';

interface RegisterUser {
  username: string;
  password: string;
  email: string;
}

interface LoginUser {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = "https://localhost:7249/api/Account"
  private loggedOnUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);
  loggedOnUser$: Observable<null | User> = this.loggedOnUser.asObservable();
  dialogOpen = false;

  constructor(
    private http: HttpClient, 
    private messageHandlingService: MessageHandlingService,
    private router: Router,
    public dialog: MatDialog,
    public loadingService: LoadingService) 
    { }

  /**
   * @remarks
   * Registers a User on the app 
   * 
   * @returns 
   * the registered User
   */
  register(registerUser: RegisterUser) {
    this.http.post<User>(`${this.baseUrl}/Register`, registerUser).pipe(
      tap(user => {
        if(user) {
          this.setLoggedOnUser(user),
          this.dialog.closeAll();
          this.router.navigate(['/home']);
        }
      }),
      catchError(err => {
        this.messageHandlingService.displayMessage({
          message: 'Unable to submit. There are errors on the form', 
          action: SnackbarAction.Close, 
          classType: SnackbarClassType.Error, 
          duration: SnackbarDuration.Medium
        });
        return throwError(of(console.log(err)))
      })    
      ).subscribe();
  }

  /**
   * @remarks
   * Checks whether a username has already been used and is therefore, not unique
   *  
   * @param username 
   * The username string value the user has entered
   * 
   * @returns 
   * An Observable which wraps a boolean
   */
  checkUsernameUnique(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/CheckUsername?username=${username}`);
  }


  /**
   * @remarks
   * Checks whether an account with the email address already exists
   * 
   * @param email
   * The email string to check
   * 
   * @returns
   * An Observable which wraps a boolean indicating whether an account with the email address already exists
   */
  checkEmailUnique(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/CheckEmail?email=${email}`);
  }


  /**
   * @remarks
   * logs a User in
   * 
   * @returns 
   * the logged in User
   */
  login(loginUser: LoginUser) {
    this.http.post<User>(`${this.baseUrl}/Login`, loginUser).pipe(
      tap(user => {
        if(user) {
          this.setLoggedOnUser(user);
          this.dialog.closeAll();
          this.router.navigate(['/home']);
        }
      }),
      catchError(err => {        
        if(err.error.isNotAllowed && !err.error.succeeded) {
          this.messageHandlingService.displayMessage({
            message: 'Unable to login. Please check Username and Password are correct', 
            action: SnackbarAction.Close, 
            classType: SnackbarClassType.Error, 
            duration: SnackbarDuration.Medium
          });
        } else {
          this.messageHandlingService.displayMessage({
            message: 'Unable to login. There are errors on the form', 
            action: SnackbarAction.Close, 
            classType: SnackbarClassType.Error, 
            duration: SnackbarDuration.Medium
          });
        }
        return throwError(of(console.log(err)))
      })
    ).subscribe();
  }

  /**
   * @remarks
   * Logs a user out of the app
   */
  logout() {
      this.setLoggedOnUser(null);
  }

  /**
   * @remarks
   * Sets the logged on User
   */
  setLoggedOnUser(user: User | null) {
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedOnUser.next(user);
  }
}
