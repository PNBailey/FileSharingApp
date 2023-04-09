import { Component } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { LoadingObsName, LoadingService } from '../services/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { NgIf, AsyncPipe } from '@angular/common';

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
    imports: [NgIf, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatTooltipModule, MatButtonModule, AsyncPipe]
})

export class AccountDialogComponent {
  
  constructor(
    public accountService: AccountService,
    public loadingService: LoadingService
  ) { }

  checkingUsername$ = this.loadingService.getLoadingObs(LoadingObsName.CHECKING_USERNAME);
  checkingEmail$ = this.loadingService.getLoadingObs(LoadingObsName.CHECKING_EMAIL);

  accountAccessObs$: Observable<{userIsRegistering: boolean, form: UntypedFormGroup, action: Action}> = combineLatest(([
    this.accountService.userIsRegistering$, 
    this.accountService.accountAccessForm$, 
    this.accountService.accountAction$,
  ]), (userIsRegistering, accountAccessForm, accountAction) => {
    return {
      userIsRegistering: userIsRegistering,
      form: accountAccessForm,
      action: accountAction
    }
  });

  onFormSubmit(form: UntypedFormGroup) {
    this.accountService.onAccountAccessFormSubmitted(form.value);
  }
  
  toggleUserIsRegistering() {
    this.accountService.toggleUserIsRegistering();
  }
}
