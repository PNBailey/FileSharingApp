import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        NgIf,
        MatMenuModule,
        RouterLink,
        AsyncPipe
    ],
})
export class ToolbarComponent {

  @Output() logoutUser = new EventEmitter();
  @Output() openAccountDialog = new EventEmitter();
  @Output() routeToEditProfile = new EventEmitter();
  
  @Input() loggedOnUser$: Observable<User | null>;

  openDialog(): void {
      this.openAccountDialog.emit();
  }

  logout() {    
      this.logoutUser.emit();
  }

  openEditProfile() {
      this.routeToEditProfile.emit();
  }
}
