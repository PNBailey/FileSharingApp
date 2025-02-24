import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppFile } from '../models/app-file';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { FileType } from '../models/file-type';
import { FileSearch } from '../models/file-search';
import { PaginatedResponse } from '../models/paginated-response';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    baseUrl = `${environment.baseUrl}/File`;

    constructor(
        private http: HttpClient,
    ) { }

    uploadFile(file: AppFile) {
        const formData = new FormData();
        formData.append('originalFile', file.originalFile);
        formData.append('fileData', JSON.stringify(file));
        return this.http.post<AppFile>(this.baseUrl, formData);
    }

    getFiles(fileSearch: FileSearch) {
        return this.http.post<PaginatedResponse<AppFile>>(`${this.baseUrl}/GetFiles`, fileSearch);
    }

    getFolderFiles(folderId: number) {
        return this.http.get<AppFile[]>(`${this.baseUrl}/Folder/${folderId}`);
    }

    deleteFile(file: AppFile) {
        return this.http.delete(`${this.baseUrl}/${file.id}`).pipe(
            map(() => file)
        );
    }

    updateFile(file: AppFile) {
        return this.http.put(`${this.baseUrl}/Update`, file).pipe(
            map(() => file)
        );
    }

    getFileTypes() {
        return this.http.get<FileType[]>(`${this.baseUrl}/FileTypes`);
    }

    downloadFile(fileName: string) {
        return this.http.get(`${this.baseUrl}/DownloadFile/${fileName}`)
    }
}
