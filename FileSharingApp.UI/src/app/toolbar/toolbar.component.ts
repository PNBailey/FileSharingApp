import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AccountService } from '../services/account.service';
import { AccountDialogComponent } from '../account/account-dialog.component';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    standalone: true,
    imports: [
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      NgIf,
      MatMenuModule,
      RouterLink,
      AsyncPipe,
      MatDialogModule
    ]
})
export class ToolbarComponent {

  @Output() showSideNav = new EventEmitter();
  @Input() loggedOnUser$: Observable<User | null>;

  constructor(
    private accountService: AccountService, 
    public dialog: MatDialog
  ) { }

  openSideNav() {
    this.showSideNav.emit();
  }

  openDialog(): void {
    this.dialog.open(AccountDialogComponent, {
      maxWidth: '350px'
    });
  }

  logout() {    
    this.accountService.logout();
  }
}
