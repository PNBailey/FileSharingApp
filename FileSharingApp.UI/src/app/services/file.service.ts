import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppFile } from '../models/app-file';
import { environment } from 'src/environments/environment';
import { map, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    baseUrl = `${environment.baseUrl}/File`;

    constructor(
        private http: HttpClient
    ) { }

    uploadFile(file: File, folderId: number | null) {
        const formData = new FormData();
        formData.append('file', file);
        const url = folderId ? `${this.baseUrl}/${folderId}` : this.baseUrl
        return this.http.post<AppFile>(url, formData);
    }

    getAllFiles() {
        return this.http.get<AppFile[]>(this.baseUrl);
    }

    getFolderFiles(folderId: number) {
        return this.http.get<AppFile[]>(`${this.baseUrl}/Folder/${folderId}`);
    }

    deleteFile(file: AppFile) {
        const encodedUrl = encodeURIComponent(file.url);
        return this.http.delete(`${this.baseUrl}/${encodedUrl}`).pipe(
            map(() => file)
        );
    }

    updateFile(file: AppFile) {
        return this.http.put(`${this.baseUrl}/Update`, file).pipe(
            map(() => file)
        );
    }
}
