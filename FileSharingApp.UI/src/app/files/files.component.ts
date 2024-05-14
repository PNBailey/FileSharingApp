import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { FilesActions } from '../state/file/file.actions';
import { getFiles } from '../state/file/file.selector';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { AppFile } from '../models/app-file';
import { FileComponent } from './file/file.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ActivatedRoute } from '@angular/router';
import { getFolderById } from '../state/folder/folder.selector';
import { Folder } from '../models/folder';

@Component({
    selector: 'app-files',
    standalone: true,
    imports: [
        CommonModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        FileComponent,
        MatDialogModule
    ],
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss']
})
export class FilesComponent {

    files$: Observable<AppFile[]> = this.store.select(getFiles);
    folder$: Observable<Folder | null> = this.route.paramMap.pipe(
        map((params) => parseInt(params.get('folderId'))),
        tap((folderId) => {
            folderId > 0 ?
                this.store.dispatch(FilesActions.getFolderFiles({ folderId: folderId })) :
                this.store.dispatch(FilesActions.getAllFiles());
        }),
        switchMap((folderId) => this.store.select(getFolderById(folderId)))
    );

    constructor(
        private store: Store,
        public dialog: MatDialog,
        private route: ActivatedRoute
    ) { }

    openDialog() {
        this.dialog.open(FileUploadComponent, {
            minWidth: '80vw',
        });
    }
}
