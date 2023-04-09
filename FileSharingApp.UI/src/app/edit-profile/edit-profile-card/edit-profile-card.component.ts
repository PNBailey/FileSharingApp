import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf, AsyncPipe } from '@angular/common';

export enum ValidFileTypes {
  JPG = "image/jpeg",
  PNG = "image/png"
}
@Component({
    selector: 'app-edit-profile-card',
    templateUrl: './edit-profile-card.component.html',
    styleUrls: ['./edit-profile-card.component.css'],
    standalone: true,
    imports: [NgIf, MatCardModule, MatIconModule, MatButtonModule, AsyncPipe]
})

export class EditProfileCardComponent {
  
  @Input() loggedOnUser$: Observable<null | User>;

  @Output() incorrectFileTypeSelected: EventEmitter<void> = new EventEmitter();
  @Output() newImageSelected: EventEmitter<File> = new EventEmitter<File>();

  onFileSelected(event: Event) {  
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.files?.length) {
      return;
    }
    const file: File = eventTarget.files[0];
    if(file.type != ValidFileTypes.JPG && file.type != ValidFileTypes.PNG) {
      this.incorrectFileTypeSelected.emit();
    } else {
      this.newImageSelected.emit(file);
    }
  }
}
