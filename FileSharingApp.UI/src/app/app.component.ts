import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FileSharingApp';

  constructor(
    private accountService: AccountService
    ) {}

  loggedOnUser$ = this.accountService.loggedOnUser$;

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    if(user) {
      this.accountService.setLoggedOnUser(user);
    }
  }
}
