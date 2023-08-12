import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, tap, withLatestFrom } from 'rxjs';
import { IdentityResult } from '../models/identity-result';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from '../models/snackbar-item';
import { User } from '../models/user';
import { LoadingObsName, LoadingService } from '../services/loading.service';
import { MessageHandlingService } from '../services/message-handling.service';
import { UserService } from '../services/user.service';
import { EditProfileInfoComponent } from './edit-profile-info/edit-profile-info.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EditProfileCardComponent } from './edit-profile-card/edit-profile-card.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AccountState } from '../state/account/account.reducer';
import { Store } from '@ngrx/store';
import { AccountActions } from '../state/account/account.actions';
import { ImageUploadResult } from '../models/image-upload-result';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, NgIf, MatProgressSpinnerModule, MatFormFieldModule, MatDividerModule, EditProfileCardComponent, MatTabsModule, MatIconModule, EditProfileInfoComponent, AsyncPipe]
})

export class EditProfileComponent {
  
  loggedOnUser$: Observable<User | null>;
  updatingProfile$: Observable<boolean> | undefined
      
  constructor(
    private messageHandlingService: MessageHandlingService,
    private userService: UserService,
    private loadingService: LoadingService,
    private accountStore: Store<{ account: AccountState }>
  ) {
    this.loggedOnUser$ = this.accountStore.select(state => state.account.loggedOnUser);
    this.updatingProfile$ = this.loadingService.getLoadingObs(LoadingObsName.UPDATING_PROFILE);
  }

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
          const updatedUser = this.updateUsersProfilePictureUrl(loggedOnUser, imageUploadResult);
          this.displayUserUpdatedMessage();
          this.accountStore.dispatch(AccountActions.setLoggedOnUser({user: updatedUser}))
        }
      })
    ).subscribe();
  }
  
  private updateUsersProfilePictureUrl(loggedOnUser: User, imageUploadResult: ImageUploadResult): User {
    let updatedUser = new User();
    updatedUser = { ...loggedOnUser };
    updatedUser.profilePictureUrl = imageUploadResult.url;
    return updatedUser;
  }

  infoUpdated(updatedUser: User) {
    this.userService.updateUserInfo(updatedUser).pipe(
      tap((res: IdentityResult) => {
        if(res.succeeded) {
          this.accountStore.dispatch(AccountActions.setLoggedOnUser({user: updatedUser}))
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
