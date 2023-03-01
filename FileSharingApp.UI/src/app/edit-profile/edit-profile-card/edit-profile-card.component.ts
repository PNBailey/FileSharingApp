import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-profile-card',
  templateUrl: './edit-profile-card.component.html',
  styleUrls: ['./edit-profile-card.component.css']
})
export class EditProfileCardComponent {
  @Input('bio') bio: string;
  @Input('profilePictureUrl') profilePictureUrl: string;
}
