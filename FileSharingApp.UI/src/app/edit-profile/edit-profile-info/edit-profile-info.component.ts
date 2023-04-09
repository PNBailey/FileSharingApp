import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, withLatestFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { LoadingObsName, LoadingService } from 'src/app/services/loading.service';
import { ValidationService } from 'src/app/services/validation.service';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-edit-profile-info',
    templateUrl: './edit-profile-info.component.html',
    styleUrls: ['./edit-profile-info.component.css'],
    standalone: true,
    imports: [NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, TextFieldModule, MatButtonModule, AsyncPipe]
})
export class EditProfileInfoComponent implements OnInit {

  constructor(private fb: FormBuilder, private validationService: ValidationService, private loadingService: LoadingService) {}
  
  @Input() loggedOnUser$: Observable<null | User>;
  @Output() infoUpdated = new EventEmitter<User>();
  
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
          'bio': this.fb.control(user?.bio, [Validators.maxLength(256)]),
          'username': this.fb.control(user?.username, [Validators.required], [this.validationService.uniqueUsernameValidatorFn(true, user?.username)]),
          'email': this.fb.control(user?.email, [Validators.required])
        })
        this.reactToFormValueChanges(form);
        return form;
      })
    )
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
