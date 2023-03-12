import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingObsName, LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  uploadProfilePicture(file: File) {
    this.loadingService.toggleLoadingObs(LoadingObsName.UPLOADING_PROFILE_PICTURE);
    const formData = new FormData();
    formData.append('image', file);      
    return this.http.post<any>(`https://localhost:7249/api/User/Upload-Profile-Picture`, formData).pipe(
      finalize(() => {
        this.loadingService.toggleLoadingObs(LoadingObsName.UPLOADING_PROFILE_PICTURE)
      })
    )
  }
}
