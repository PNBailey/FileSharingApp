import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { User } from '../models/user';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  constructor(
    private http: HttpClient, 
    public dialog: MatDialog,
    public loadingService: LoadingService
  ) { }

  private baseUrl = "https://localhost:7249/api/Account";

  loginOrRegister(user: RegisterUser | LoginUser, url: string) {
    return this.http.post<User>(`${this.baseUrl}${url}`, user);
  }
}
