import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginUser } from '../models/login-user';
import { RegisterUser } from '../models/register-user';
import { User } from '../models/user';
import { LoadingService } from './loading.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  constructor(
    private http: HttpClient, 
    public dialog: MatDialog,
    public loadingService: LoadingService
  ) { }

  private baseUrl = `${environment.apiUrl}/Account`;

  loginOrRegister(user: RegisterUser | LoginUser, url: string) {
    return this.http.post<User>(`${this.baseUrl}${url}`, user);
  }
}
