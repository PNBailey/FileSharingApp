import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../account/account.service';
import { AccountDialogComponent } from '../account/account-dialog.component';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Output() showSideNav = new EventEmitter();
  @Input() loggedOnUser$: Observable<User | null>;

  constructor(
    private accountService: AccountService, 
    public dialog: MatDialog) { }

  openSideNav() {
    this.showSideNav.emit();
  }

  openDialog(): void {
    this.dialog.open(AccountDialogComponent, {
      width: '350px'
    });
  }

  logout() {    
    this.accountService.logout();
  }
}
