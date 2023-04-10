import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AccountDialogComponent } from './account/account-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [ToolbarComponent, RouterOutlet, MatSidenavModule, MatDialogModule]
})

export class AppComponent implements OnInit {
  title = 'FileSharingApp';
  localStorageUser: User;

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog
  ) {}

  loggedOnUser$ = this.accountService.loggedOnUser$;

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    this.localStorageUser = JSON.parse(JSON.stringify(localStorage.getItem('user')));
    if(this.localStorageUser) {
      this.accountService.setLoggedOnUser(this.localStorageUser);
    }
  }

  logoutUser() {
    this.accountService.logout();
  }

  openDialog(): void {
    this.dialog.open(AccountDialogComponent, {
      width: '350px'
    });
  }
}
