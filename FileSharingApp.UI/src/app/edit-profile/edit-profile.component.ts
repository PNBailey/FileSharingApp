import { Component, Input } from '@angular/core';
import { SnackbarAction, SnackbarClassType, SnackbarDuration } from '../models/snackbar-item';
import { MessageHandlingService } from '../services/message-handling.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  constructor(private messageHandlingService: MessageHandlingService) {}

  displayIncorrectFileTypeMessage() {
    this.messageHandlingService.onDisplayNewMessage({
      message: "File selected must be JPEG or PNG file",
      action: SnackbarAction.Close,
      classType: SnackbarClassType.Error,
      duration: SnackbarDuration.Medium
    });
  }

  uploadNewProfilePicture() {
    
  }
}
