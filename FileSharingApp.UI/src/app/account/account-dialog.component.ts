import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule, FormControl, Validators, FormBuilder } from '@angular/forms';
import { combineLatest, map, Observable, scan, startWith, Subject, tap, withLatestFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { NgIf, AsyncPipe } from '@angular/common';
import { RegisterUser } from '../models/register-user';
import { LoginUser } from '../models/login-user';
import { ValidationService } from '../services/validation.service';
import { Store } from '@ngrx/store';
import { AccountState } from '../state/account/account.reducer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getLoadingBool } from '../state/loading/loading.selector';
import { LoadingBoolName } from '../state/loading/loading.reducer';
import { AccountActions } from '../state/account/account.actions';

export interface Action {
    type: string,
    linkLabel: string,
    linkText: string,
    buttonAction: string
}

@Component({
    selector: 'app-login-register-dialog',
    templateUrl: './account-dialog.component.html',
    styleUrls: ['./account-dialog.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatButtonModule,
        AsyncPipe
    ]
})

export class AccountDialogComponent {

    destroyRef = inject(DestroyRef);

    constructor(
        private validationService: ValidationService,
        private fb: FormBuilder,
        private store: Store<{ account: AccountState }>
    ) {
        this.accountAccessFormSubmitted.pipe(
            withLatestFrom(this.loginRegisterUrl$),
            tap(([formValue, loginRegisterUrl]) => {
                this.store.dispatch(AccountActions.loginOrRegister({
                    user: formValue,
                    url: loginRegisterUrl
                }))
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    checkingUsername$ = this.store.select(getLoadingBool(LoadingBoolName.CHECKING_USERNAME));
    checkingEmail$ = this.store.select(getLoadingBool(LoadingBoolName.CHECKING_EMAIL));

    private accountAccessFormSubmitted: Subject<RegisterUser | LoginUser> = new Subject();
    private userIsRegisteringToggle = new Subject<void>();

    private userIsRegistering$: Observable<boolean> = this.userIsRegisteringToggle.pipe(
        scan(previous => !previous, false),
        startWith(false)
    );

    private loginRegisterUrl$ = this.userIsRegistering$.pipe(
        map(userIsRegistering => {
            const loginRegisterUrl = userIsRegistering ? `/Register` : `/Login`;
            return loginRegisterUrl;
        })
    );

    private accountAccessForm$: Observable<UntypedFormGroup> = this.userIsRegistering$.pipe(
        map((userIsRegistering) => {
            const form = this.buildLoginForm(userIsRegistering);
            if (userIsRegistering) {
                this.createEmailFormControl(form);
            }
            return form;
        })
    );

    private accountAction$: Observable<Action> = this.userIsRegistering$.pipe(
        map(userIsRegistering => {
            return {
                type: userIsRegistering ? 'Register' : 'Login',
                linkLabel: userIsRegistering ? 'Already have an account?' : 'No account?',
                linkText: userIsRegistering ? 'Login' : 'Register',
                buttonAction: userIsRegistering ? 'Register' : 'Login',
            }
        })
    );

    accountAccessObs$: Observable<{ userIsRegistering: boolean, form: UntypedFormGroup, action: Action }> = combineLatest(([
        this.userIsRegistering$,
        this.accountAccessForm$,
        this.accountAction$,
    ]), (userIsRegistering, accountAccessForm, accountAction) => {
        return {
            userIsRegistering: userIsRegistering,
            form: accountAccessForm,
            action: accountAction
        }
    });

    onFormSubmit(form: UntypedFormGroup) {
        this.accountAccessFormSubmitted.next(form.value);
    }

    private createEmailFormControl(form: UntypedFormGroup) {
        form.addControl(
            'email',
            new FormControl(
                '',
                [Validators.required, Validators.email],
                [this.validationService.uniqueEmailValidatorFn()]
            )
        );
    }

    toggleUserIsRegistering() {
        this.userIsRegisteringToggle.next();
    }

    private buildLoginForm(userIsRegistering: boolean) {
        return this.fb.group({
            'username': ['', [Validators.required], [this.validationService.uniqueUsernameValidatorFn(userIsRegistering)]],
            'password': ['', [Validators.required]]
        });
    }

}
