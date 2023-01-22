import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../account/account.service';
import { AccountDialogComponent } from '../account/account-dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() showSideNav = new EventEmitter();

  constructor(
    public accountService: AccountService, 
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

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
