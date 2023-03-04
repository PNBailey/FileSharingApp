import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('image', file);      
    return this.http.post(`https://localhost:7249/api/User/Upload-Profile-Picture`, formData);
  }
}
