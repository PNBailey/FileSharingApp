import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-edit-profile-info',
  templateUrl: './edit-profile-info.component.html',
  styleUrls: ['./edit-profile-info.component.css']
})
export class EditProfileInfoComponent implements OnInit {
  @Input('loggedOnUser$') loggedOnUser$: Observable<null | User>;
  
  userInfoForm$: Observable<UntypedFormGroup>;

  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.userInfoForm$ = this.loggedOnUser$.pipe(
      map(user => {
        return this.fb.group({
          'bio': this.fb.control(user?.bio, [Validators.maxLength(256)]),
          'username': this.fb.control(user?.username, [Validators.required]),
          'email': this.fb.control(user?.email, [Validators.required])
        });
      })
    )
  }
}
