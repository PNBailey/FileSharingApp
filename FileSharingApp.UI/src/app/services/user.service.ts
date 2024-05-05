/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { IdentityResult } from '../models/identity-result';
import { User } from '../models/user';
import { LoadingObsName, LoadingService } from './loading.service';
import { ImageUploadResult } from '../models/image-upload-result';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl = 'https://localhost:7249/api/User/';

    constructor(private http: HttpClient, private loadingService: LoadingService) { }

    uploadProfilePicture(file: File) {
        this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_PROFILE);
        const formData = new FormData();
        formData.append('imageFileData', file);
        // const image = new AppImage();
        // image.fileData = formData;     
        return this.http.post<ImageUploadResult>(`${this.baseUrl}Upload-Profile-Picture`, formData).pipe(
            finalize(() => {
                this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_PROFILE)
            })
        )
    }

    updateUserInfo(updatedUser: User) {
        this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_PROFILE);
        return this.http.put<IdentityResult>(`${this.baseUrl}Update`, updatedUser).pipe(
            finalize(() => {
                this.loadingService.toggleLoadingObs(LoadingObsName.UPDATING_PROFILE)
            })
        );
    }
}
