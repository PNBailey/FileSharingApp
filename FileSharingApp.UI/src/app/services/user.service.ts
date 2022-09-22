import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /***
   * @remarks 
   * Gets all the users of the app
   * 
   * @returns
   * An array of app users
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`https://localhost:7249/api/Users`);
  }
}
