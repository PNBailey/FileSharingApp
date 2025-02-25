import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AccountDialogComponent } from './account/account-dialog.component';
import { Store } from '@ngrx/store';
import { AccountActions } from './state/account/account.actions';
import { Observable, filter, of, switchMap, tap } from 'rxjs';
import { User } from './models/user';
import { AsyncPipe, NgIf } from '@angular/common';
import { getLoggedOnUser } from './state/account/account.selectors';
import { SidenavComponent } from './sidenav/sidenav.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FolderActions } from './state/folder/folder.actions';
import { Folder } from './models/folder';
import { getAllFolders } from './state/folder/folder.selector';
import { FolderDialogComponent } from './sidenav/folder-dialog/folder-dialog.component';

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
    destroyRef = inject(DestroyRef);
    loggedOnUser$: Observable<User | null> = this.store.select(getLoggedOnUser);

    constructor(
        public dialog: MatDialog,
        private store: Store,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.setCurrentUser();
    }

    getFolders() {
        this.store.dispatch(FolderActions.getAllFolders());
    }

    setCurrentUser() {
        const storedUser = localStorage.getItem('user');
        if (storedUser != 'null') {
            this.router.navigateByUrl('/files')
            this.store.dispatch(AccountActions.setLoggedOnUser({ user: JSON.parse(storedUser) }));
        } else {
            this.router.navigateByUrl('/home')
        }
    }

    logoutUser() {
        this.store.dispatch(AccountActions.logout());
    }

    openAccountDialog(): void {
        this.dialog.open(AccountDialogComponent, {
            width: '350px'
        });
    }

    openFolderDialog(folderToUpdate: Folder = null) {
        const dialogRef = this.dialog.open(FolderDialogComponent, {
            width: '500px',
            data: {
                folderToUpdate: folderToUpdate
            }
        });

        dialogRef.afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((folder: Folder) => {
                if (folder) {
                    if (!folderToUpdate) {
                        this.store.dispatch(FolderActions.addNewFolder({ folder: folder }));
                    } else {
                        this.store.dispatch(FolderActions.editFolder({ folder: folder }));
                    }
                }
            })
    }

    routeToEditProfile() {
        this.router.navigateByUrl('/edit-profile');
    }

    changeFolderParent(updateEvent: { folderId: number, parentFolderId: number }) {
        this.store.dispatch(FolderActions.changeFolderParent(updateEvent))
    }

    folderSelected(selectedFolder: Folder) {
        this.router.navigateByUrl(`/files/${selectedFolder.id}`);
    }
}
