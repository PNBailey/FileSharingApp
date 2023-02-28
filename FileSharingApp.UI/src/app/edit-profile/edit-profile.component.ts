import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  @Input('bio') bio: string;
  @Input('profilePictureUrl') profilePictureUrl: string;
}
