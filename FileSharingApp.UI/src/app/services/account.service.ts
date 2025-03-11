import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginUser } from '../models/login-user';
import { RegisterUser } from '../models/register-user';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AccountService {

    constructor(
        private http: HttpClient,
        public dialog: MatDialog
    ) { }

    private baseUrl = "https://localhost:7249/api/Account";

    loginOrRegister(user: RegisterUser | LoginUser, url: string) {
        return this.http.post<User>(`${this.baseUrl}${url}`, user);
    }

    checkUsernameUnique(username: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/CheckUsername?username=${username}`);
    }

    checkEmailUnique(email: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/CheckEmail?email=${email}`);
    }
}
