import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { LoadingService } from 'src/app/services/loading.service';
import { EmailValidator } from 'src/app/shared/validators/email-validator';
import { UsernameValidator } from 'src/app/shared/validators/username-validator';

@Component({
  selector: 'app-login-register-dialog',
  templateUrl: './login-register-dialog.component.html',
  styleUrls: ['./login-register-dialog.component.css']
})
export class LoginRegisterDialogComponent implements OnInit {
  register = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  componentIsDestroyed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  test = true;

  constructor(
    public accountService: AccountService, 
    public loadingService: LoadingService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  switchToRegisterUser() {
    this.buildRegisterForm();
    this.register = true;
  }

  registerUser() {
    this.accountService.register(this.registerForm.value);
  }

  loginUser() {
    this.accountService.login(this.loginForm.value);
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
