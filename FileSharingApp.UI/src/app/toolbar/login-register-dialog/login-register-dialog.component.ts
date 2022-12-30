import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { LoadingService } from 'src/app/services/loading.service';
import { EmailValidator } from 'src/app/shared/validators/email-validator';
import { UsernameValidator } from 'src/app/shared/validators/username-validator';

@Component({
  selector: 'app-login-register-dialog',
  templateUrl: './login-register-dialog.component.html',
  styleUrls: ['./login-register-dialog.component.scss']
})
export class LoginRegisterDialogComponent implements OnInit {
  register = false;
  registerForm: UntypedFormGroup;
  loginForm: UntypedFormGroup;

  constructor(
    public accountService: AccountService, 
    public loadingService: LoadingService,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  loginUser() {    
    this.accountService.login(this.loginForm.value).subscribe();
  }
  
  registerUser() {
    this.accountService.register(this.registerForm.value).subscribe();
  }
  
  switchToRegisterUser() {
    this.buildRegisterForm();
    this.register = true;
  }

  buildRegisterForm() {
    this.registerForm = this.fb.group({
      'username': ['', [Validators.required], [UsernameValidator.uniqueUsernameValidatorFn(this.accountService, this.loadingService, false)]],
      'password': ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      'email': ['', [Validators.required, Validators.email], [EmailValidator.uniqueEmailValidatorFn(this.accountService, this.loadingService)]]
    });
  }

  buildLoginForm() {
    this.loginForm = this.fb.group({
      'username': ['', [Validators.required], [UsernameValidator.uniqueUsernameValidatorFn(this.accountService, this.loadingService, true)]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
    });
  }
}
