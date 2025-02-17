import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { ImageUploadResult } from '../models/image-upload-result';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl = 'https://localhost:7249/api/User/';

    constructor(
        private http: HttpClient
    ) { }

    uploadProfilePicture(file: File) {
        const formData = new FormData();
        formData.append('imageFileData', file);
        return this.http.post<{ signedUrl: string }>(`${this.baseUrl}Upload-Profile-Picture`, formData);
    }

    updateUserInfo(updatedUser: User) {
        return this.http.put<User>(`${this.baseUrl}Update`, updatedUser);
    }
}
