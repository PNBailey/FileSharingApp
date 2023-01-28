import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { User } from '../models/user';
import { LoadingService } from '../services/loading.service';
import { ValidationService } from '../shared/validators/validation.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  constructor(
    private http: HttpClient, 
    private router: Router,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    private fb: UntypedFormBuilder,
    private validationService: ValidationService
  ) { }

  baseUrl = "https://localhost:7249/api/Account";

  private loggedOnUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);
  loggedOnUser$: Observable<null | User> = this.loggedOnUser.asObservable();

  private accountAccessFormSubmitted: Subject<RegisterUser | LoginUser> = new Subject();
  accountAccessFormSubmitted$: Observable<RegisterUser | LoginUser> = this.accountAccessFormSubmitted.asObservable();

  private userIsRegistering: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userIsRegistering$: Observable<boolean> = this.userIsRegistering.asObservable();

  accountAccessForm$: Observable<UntypedFormGroup> = this.userIsRegistering$.pipe(
    map((userIsRegistering) => {
      const form = this.fb.group({
        'username': ['', [Validators.required], [this.validationService.uniqueUsernameValidatorFn(userIsRegistering)]],
        'password': ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]]
      });
      if(userIsRegistering) {
        form.addControl('email', new FormControl('', [Validators.required, Validators.email], [this.validationService.uniqueEmailValidatorFn()]));
      } 
      return form;
    })
  );

  accountAction$: Observable<{type: string, linkLabel: string, linkText: string, buttonAction: string}> = this.userIsRegistering$.pipe(
    map(userIsRegistering => {
      return {
        type: userIsRegistering ? 'Register' : 'Login',
        linkLabel: userIsRegistering ? 'Already have an account?' : 'No account?',
        linkText: userIsRegistering ? 'Login' : 'Register',
        buttonAction: userIsRegistering ? 'Register' : 'Login',
      }
    })
  );

  handleAccountAccessFormSubmitted$ = this.accountAccessFormSubmitted$.pipe(
      switchMap((formValue) => this.loginOrRegister(formValue))
    ).subscribe();

  onAccountAccessFormSubmitted(formValue: RegisterUser | LoginUser) {
    this.accountAccessFormSubmitted.next(formValue);
  }

  toggleUserIsRegistering() {
    this.userIsRegistering.next(!this.userIsRegistering.getValue());
  }

  getUserIsRegisteringValue() {
    return this.userIsRegistering.getValue();
  }

  loginOrRegister(user: RegisterUser | LoginUser) {
    const url = this.getUserIsRegisteringValue() ? `${this.baseUrl}/Register` : `${this.baseUrl}/Login`;
    return this.http.post<User>(url, user).pipe(
      tap(user => {
        if(user) {
          this.setLoggedOnUser(user),
          this.dialog.closeAll();
          this.router.navigate(['/home']);
        }
      })    
    );
  }

  logout() {
      this.setLoggedOnUser(null);
  }

  setLoggedOnUser(user: User | null) {
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedOnUser.next(user);
  }
}
