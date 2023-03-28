import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { map, Observable, withLatestFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { LoadingObsName, LoadingService } from 'src/app/services/loading.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-edit-profile-info',
  templateUrl: './edit-profile-info.component.html',
  styleUrls: ['./edit-profile-info.component.css']
})
export class EditProfileInfoComponent implements OnInit {

  constructor(private fb: FormBuilder, private validationService: ValidationService, private loadingService: LoadingService) {}
  
  @Input('loggedOnUser$') loggedOnUser$: Observable<null | User>;
  @Output('infoUpdated') infoUpdated = new EventEmitter<User>();
  
  userInfoForm$: Observable<UntypedFormGroup>;
  updatedUser: User;
  checkingUsername$ = this.loadingService.getLoadingObs(LoadingObsName.CHECKING_USERNAME);
  checkingEmail$ = this.loadingService.getLoadingObs(LoadingObsName.CHECKING_EMAIL);

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.userInfoForm$ = this.loggedOnUser$.pipe(
      map(user => {
        const form = this.fb.group({
          'bio': this.fb.control('', [Validators.maxLength(256)]),
          'username': this.fb.control('', [Validators.required], [this.validationService.uniqueUsernameValidatorFn(true, user?.username)]),
          'email': this.fb.control('', [Validators.required])
        })
        this.reactToFormValueChanges(form);
        this.addInitialValues(form, user);
        return form;
      })
    )
  }

  private addInitialValues(form: UntypedFormGroup, user: User | null) {
    form.patchValue({
      bio: user?.bio,
      username: user?.username,
      email: user?.email
    }, {emitEvent: false});
  }

  private reactToFormValueChanges(form: UntypedFormGroup) {
    form.valueChanges.pipe(
      withLatestFrom(this.loggedOnUser$),
      map(([formValue, originalUser]) => {        
        this.updatedUser = {
          ...originalUser,
          ...formValue
        } as User;        
      })
    ).subscribe();
  }

  updateInfo() {
    this.infoUpdated.emit(this.updatedUser);
  }
}
