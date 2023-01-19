import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { LoadingService } from '../services/loading.service';

export interface Action {
  type: string, 
  linkLabel: string, 
  linkText: string, 
  buttonAction: string
}

@Component({
  selector: 'app-login-register-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})

export class AccountDialogComponent {

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

  constructor(
    public accountService: AccountService,
    public loadingService: LoadingService
  ) { }

  onFormSubmit(form: UntypedFormGroup) {
    this.accountService.onAccountAccessFormSubmitted(form.value);
  }
  
  toggleUserIsRegistering() {
    this.accountService.toggleUserIsRegistering();
  }
}
