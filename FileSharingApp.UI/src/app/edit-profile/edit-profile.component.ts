import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from '../models/snackbar-item';
import { User } from '../models/user';
import { MessageHandlingService } from '../services/message-handling.service';
import { EditProfileInfoComponent } from './edit-profile-info/edit-profile-info.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EditProfileCardComponent } from './edit-profile-card/edit-profile-card.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AccountActions } from '../state/account/account.actions';
import { getLoggedOnUser } from '../state/account/account.selectors';
import { getLoadingBool } from '../state/loading/loading.selector';
import { LoadingBoolName } from '../state/loading/loading.reducer';
import { AppFile } from '../models/app-file';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, NgIf, MatProgressSpinnerModule, MatFormFieldModule, MatDividerModule, EditProfileCardComponent, MatTabsModule, MatIconModule, EditProfileInfoComponent, AsyncPipe]
})

export class EditProfileComponent {

    loggedOnUser$: Observable<User | null> = this.store.select(getLoggedOnUser);
    updatingProfile$: Observable<boolean> | undefined = this.store.select(getLoadingBool(LoadingBoolName.UPDATING_PROFILE));

    constructor(
        private messageHandlingService: MessageHandlingService,
        private store: Store
    ) { }

    displayIncorrectFileTypeMessage() {
        this.messageHandlingService.onDisplayNewMessage({
            message: "File selected must be JPEG or PNG file",
            action: SnackbarAction.Close,
            classType: SnackbarClassType.Error,
            duration: SnackbarDuration.Medium
        });
    }

    uploadProfilePicture(file: File) {
        this.store.dispatch(AccountActions.uploadProfilePicture({ file: file }));
    }

    infoUpdated(updatedUser: User) {
        this.store.dispatch(AccountActions.updateUserInfo({ updatedUser: updatedUser }));
    }
}
