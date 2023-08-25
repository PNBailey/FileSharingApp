import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AccountDialogComponent } from './account/account-dialog.component';
import { Store } from '@ngrx/store';
import { AccountActions, AccountAppCompActions } from './state/account/account.actions';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { AsyncPipe, NgIf } from '@angular/common';
import { getLoggedOnUser } from './state/account/account.selectors';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NewFolderDialogComponent } from './sidenav/new-folder-dialog/new-folder-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
        SidenavComponent,
        MatDialogModule
    ]
})

export class AppComponent implements OnInit {
    title = 'FileSharingApp';

    constructor(
        public dialog: MatDialog,
        private store: Store,
        private router: Router
    ) {}

    loggedOnUser$: Observable<User | null> = this.store.select(getLoggedOnUser);

    ngOnInit(): void {
        this.setCurrentUser();
    }

    setCurrentUser() {
        const storedUser = localStorage.getItem('user');    
        if (storedUser) {
            this.store.dispatch(AccountActions.setLoggedOnUser({ user: JSON.parse(storedUser) }));
        }
    }

    logoutUser() {
        this.store.dispatch(AccountAppCompActions.logout());
        this.router.navigateByUrl('/home');
    }

    openAccountDialog(): void {
        this.dialog.open(AccountDialogComponent, {
            width: '350px'
        });
    }

    openNewFolderDialog() {
        const dialogRef = this.dialog.open(NewFolderDialogComponent, {
            width: '500px'
        });

        dialogRef.afterClosed()
            .pipe(takeUntilDestroyed())
            .subscribe(folder => {
                
            })
    }

    routeToEditProfile() {
        this.router.navigateByUrl('/edit-profile');
    }
}
