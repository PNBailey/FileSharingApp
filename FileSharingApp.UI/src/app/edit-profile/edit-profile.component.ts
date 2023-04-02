import { Component } from '@angular/core';
import { Observable, tap, withLatestFrom } from 'rxjs';
import { AccountService } from '../account/account.service';
import { IdentityResult } from '../models/identityResult';
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
  
  updatingProfile$ = this.loadingService.getLoadingObs(LoadingObsName.UPDATING_PROFILE);

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
        if(loggedOnUser && imageUploadResult.error == null) {
          loggedOnUser.profilePictureUrl = imageUploadResult.url;
          this.displayUserUpdatedMessage();
        }
        this.accountService.setLoggedOnUser(loggedOnUser);
      })
    ).subscribe();
  }
  
  infoUpdated(updatedUser: User) {
    this.userService.updateUserInfo(updatedUser).pipe(
      tap((res: IdentityResult) => {
        if(res.succeeded) {
          this.accountService.setLoggedOnUser(updatedUser);
          this.displayUserUpdatedMessage();
        }
      })  
    ).subscribe();    
  }

  private displayUserUpdatedMessage() {
    this.messageHandlingService.onDisplayNewMessage({
      message: "Successfully Updated",
      action: SnackbarAction.Close,
      classType: SnackbarClassType.Success,
      duration: SnackbarDuration.Medium
    });
  }
}
