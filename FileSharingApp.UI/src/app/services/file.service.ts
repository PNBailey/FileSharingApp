import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  baseUrl = "https://localhost:7249/api/File";

  constructor(
    private http: HttpClient
  ) { }
  
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}`, formData);
  }
}
