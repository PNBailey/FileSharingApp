import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AccountDialogComponent } from './account/account-dialog.component';
import { AccountState } from './state/account/account.reducer';
import { Store } from '@ngrx/store';
import { AccountActions, AccountAppCompActions } from './state/account/account.actions';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { AsyncPipe, NgIf } from '@angular/common';
import { selectAccountLoggedOnUser } from './state/account/account.selectors';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ToolbarComponent,
    MatDialogModule,
    NgIf,
    AsyncPipe,
    SidenavComponent
  ]
})

export class AppComponent implements OnInit {
  title = 'FileSharingApp';

  constructor(
    public dialog: MatDialog,
    private accountStore: Store<{ account: AccountState }>,
    private router: Router
  ) {}

  loggedOnUser$: Observable<User | null> = this.accountStore.select(selectAccountLoggedOnUser);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const storedUser = localStorage.getItem('user');    
    if (storedUser) {
       this.accountStore.dispatch(AccountActions.setLoggedOnUser({ user: JSON.parse(storedUser) }));
    }
  }

  logoutUser() {
    this.accountStore.dispatch(AccountAppCompActions.logout());
    this.router.navigateByUrl('/home');
  }

  openDialog(): void {
    this.dialog.open(AccountDialogComponent, {
      width: '350px'
    });
  }

  routeToEditProfile() {
    this.router.navigateByUrl('/edit-profile');
  }

  goToMyFiles() {
    this.router.navigateByUrl('/my-files');
  }
}
