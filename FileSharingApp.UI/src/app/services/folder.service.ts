import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Folder } from '../models/folder';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FolderService {

    private baseUrl = `${environment.baseUrl}/Folder`;

    constructor(private http: HttpClient) { }

    createFolder(folder: Folder): Observable<Folder> {
        return this.http.post<Folder>(this.baseUrl, folder);
    }

    updateFolder(folder: Folder): Observable<Folder> {
        return this.http.put<Folder>(this.baseUrl, folder);
    }

    getFolder(folderId: number): Observable<any> {
        const url = `${this.baseUrl}/${folderId}`;
        return this.http.get(url);
    }

    getFoldersList(): Observable<Folder[]> {
        return this.http.get<Folder[]>(this.baseUrl);
    }

    changeFolderParent(folderId: number, newParentFolderId: number) {
        return this.http.post(`${this.baseUrl}/changeFolderParent/${folderId}/${newParentFolderId}`, {});
    }

    deleteFolder(folderId: number) {
        const url = `${this.baseUrl}/${folderId}`;
        return this.http.delete(url);
    }

    checkFolderNameUnique(folderName: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/CheckFolderName?folderName=${folderName}`);
    }
}
