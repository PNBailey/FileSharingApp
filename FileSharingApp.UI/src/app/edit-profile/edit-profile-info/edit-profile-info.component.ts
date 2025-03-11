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
    form = this.fb.group({
        'bio': this.fb.control(null, [Validators.maxLength(256)]),
        'username': this.fb.control(null, [Validators.required], [this.validationService.usernameEditProfileFormValidatorFn()]),
        'email': this.fb.control(null, [Validators.required], [this.validationService.uniqueEmailEditProfileFormValidatorFn()])
    });

    ngOnInit(): void {
        this.reactToLoggedOnUserChanges();
        this.reactToFormValueChanges()
    }

    private reactToLoggedOnUserChanges() {
        this.loggedOnUser$.subscribe(user => {
            this.form.patchValue({
                bio: user?.bio,
                username: user?.username,
                email: user?.email
            }, { emitEvent: false })
        });
    }

    private reactToFormValueChanges() {
        this.form.valueChanges.pipe(
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
