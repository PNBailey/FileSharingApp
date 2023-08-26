import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../models/folder';

@Injectable({
    providedIn: 'root'
})
export class FolderService {

    private baseUrl = 'your_api_base_url'; // Replace with your API base URL

    constructor(private http: HttpClient) { }

    createFolder(folder: Folder): Observable<Folder> {
        return this.http.post<Folder>(`${this.baseUrl}/folder`, folder);
    }

    getFolder(folderId: number): Observable<any> {
        const url = `${this.baseUrl}/folder/${folderId}`;
        return this.http.get(url);
    }

    getFoldersList(): Observable<Folder[]> {
        const url = `${this.baseUrl}/folders`;
        return this.http.get<Folder[]>(url);
    }

    deleteFolder(folderId: number) {
        const url = `${this.baseUrl}/folders/${folderId}`;
        return this.http.delete(url);
    }
}
