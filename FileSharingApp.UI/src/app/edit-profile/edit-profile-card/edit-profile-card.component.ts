import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum ValidFileTypes {
  JPG = "image/jpeg",
  PNG = "image/png"
}
@Component({
  selector: 'app-edit-profile-card',
  templateUrl: './edit-profile-card.component.html',
  styleUrls: ['./edit-profile-card.component.css']
})

export class EditProfileCardComponent {
  @Input('bio') bio: string;
  @Input('profilePictureUrl') profilePictureUrl: string;
  @Output('incorrectFileTypeSelected') incorrectFileTypeSelected: EventEmitter<void> = new EventEmitter();
  @Output('newImageSelected') newImageSelected: EventEmitter<void> = new EventEmitter();

  onFileSelected(event: any) {  
    const file: File = event.target.files[0];
    if(file.type != ValidFileTypes.JPG && file.type != ValidFileTypes.PNG) {
      this.incorrectFileTypeSelected.emit();
    } else {
      this.newImageSelected.emit();
    }
  }
}
