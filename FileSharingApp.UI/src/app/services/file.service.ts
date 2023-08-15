import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppFile } from '../models/app-file';

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
    formData.append('fileData', file);
    return this.http.post<AppFile>(`${this.baseUrl}`, formData);
  }

  getAllFiles() {
    return this.http.get<AppFile[]>(this.baseUrl);
  }
}
