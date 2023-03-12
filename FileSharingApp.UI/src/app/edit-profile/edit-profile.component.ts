import { Component, Input } from '@angular/core';
import { finalize, Observable, pipe, tap, withLatestFrom } from 'rxjs';
import { AccountService } from '../account/account.service';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from '../models/snackbar-item';
import { User } from '../models/user';
import { LoadingObsName, LoadingService } from '../services/loading.service';
import { MessageHandlingService } from '../services/message-handling.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  constructor(
    private messageHandlingService: MessageHandlingService,
    private userService: UserService,
    private loadingService: LoadingService,
    private accountService: AccountService
  ) {}

  loggedOnUser$: Observable<null | User > = this.accountService.loggedOnUser$;
  
  uploadingProfilePicture$ = this.loadingService.getLoadingObs(LoadingObsName.UPLOADING_PROFILE_PICTURE);

  displayIncorrectFileTypeMessage() {
    this.messageHandlingService.onDisplayNewMessage({
      message: "File selected must be JPEG or PNG file",
      action: SnackbarAction.Close,
      classType: SnackbarClassType.Error,
      duration: SnackbarDuration.Medium
    });
  }

  uploadProfilePicture(file: File) {  
    this.userService.uploadProfilePicture(file).pipe(
      withLatestFrom(this.loggedOnUser$),
      tap(([imageUploadResult, loggedOnUser]) => {
        const profilePictureUrl = imageUploadResult.url;
        this.accountService.setLoggedOnUser({
          ...loggedOnUser,
          profilePictureUrl
        });
      })
    ).subscribe();
  }
}
