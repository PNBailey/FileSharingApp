import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, withLatestFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { ValidationService } from 'src/app/services/validation.service';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { getLoadingBool } from 'src/app/state/loading/loading.selector';
import { LoadingBoolName } from 'src/app/state/loading/loading.reducer';

@Component({
    selector: 'app-edit-profile-info',
    templateUrl: './edit-profile-info.component.html',
    styleUrls: ['./edit-profile-info.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, TextFieldModule, MatButtonModule, AsyncPipe]
})
export class EditProfileInfoComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private validationService: ValidationService,
        private store: Store
    ) { }

    @Input() loggedOnUser$: Observable<null | User>;
    @Output() infoUpdated = new EventEmitter<User>();

    userInfoForm$: Observable<UntypedFormGroup>;
    updatedUser: User;
    checkingUsername$ = this.store.select(getLoadingBool(LoadingBoolName.CHECKING_USERNAME));
    checkingEmail$ = this.store.select(getLoadingBool(LoadingBoolName.CHECKING_EMAIL));

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm() {
        this.userInfoForm$ = this.loggedOnUser$.pipe(
            map(user => {
                const form = this.fb.group({
                    'bio': this.fb.control(user?.bio, [Validators.maxLength(256)]),
                    'username': this.fb.control(user?.username, [Validators.required], [this.validationService.usernameRegisterFormValidatorFn()]),
                    'email': this.fb.control(user?.email, [Validators.required], [this.validationService.uniqueEmailValidatorFn()])
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
