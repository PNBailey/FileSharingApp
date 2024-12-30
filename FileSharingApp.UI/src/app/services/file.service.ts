import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppFile } from '../models/app-file';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { FileSearchParams } from '../models/file-search-params';
import { FileType } from '../models/file-type';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    baseUrl = `${environment.baseUrl}/File`;

    constructor(
        private http: HttpClient,
        private datePipe: DatePipe
    ) { }

    uploadFile(file: AppFile) {
        const formData = new FormData();
        formData.append('originalFile', file.originalFile);
        formData.append('fileData', JSON.stringify(file));
        return this.http.post(this.baseUrl, formData);
    }

    getFiles(searchParams: FileSearchParams) {
        let params = this.setSearchParams(searchParams);
        return this.http.get<AppFile[]>(`${this.baseUrl}`, { params: params });
    }

    getFolderFiles(folderId: number) {
        return this.http.get<AppFile[]>(`${this.baseUrl}/Folder/${folderId}`);
    }

    deleteFile(file: AppFile) {
        return this.http.delete(`${this.baseUrl}/${file.name}`).pipe(
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

    private setSearchParams(searchParams: FileSearchParams) {
        let params = new HttpParams();
        if (searchParams.name) {
            params = params.set('name', searchParams.name);
        }
        if (searchParams.fileType) {
            params = params.set('fileTypeId', searchParams.fileType.id);
        }
        if (searchParams.folder) {
            params = params.set('folderId', searchParams.folder.id);
        }
        if (searchParams.lastModifiedRange[0]) {
            params = params.set('lastModifiedStartDate', searchParams.lastModifiedRange[0].toLocaleDateString("en-GB"));
        }
        if (searchParams.lastModifiedRange[1]) {
            params = params.set('lastModifiedEndDate', searchParams.lastModifiedRange[1].toLocaleDateString("en-GB"));
        }
        return params;
    }
}
