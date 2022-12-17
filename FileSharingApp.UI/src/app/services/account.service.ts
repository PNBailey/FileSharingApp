import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { LoadingService } from './loading.service';
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
    private router: Router,
    public dialog: MatDialog,
    public loadingService: LoadingService) 
    { }

  register(registerUser: RegisterUser) {    
    return this.http.post<User>(`${this.baseUrl}/Register`, registerUser).pipe(
      tap(user => {
        if(user) {
          this.setLoggedOnUser(user),
          this.dialog.closeAll();
          this.router.navigate(['/home']);
        }
      })    
    );
  }

  checkUsernameUnique(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/CheckUsername?username=${username}`);
  }

  checkEmailUnique(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/CheckEmail?email=${email}`);
  }

  login(loginUser: LoginUser) {
    return this.http.post<User>(`${this.baseUrl}/Login`, loginUser).pipe(
      tap(user => {
        if(user) {
          this.setLoggedOnUser(user);
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
