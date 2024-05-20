import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { FilesActions } from '../state/file/file.actions';
import { getFiles } from '../state/file/file.selector';
import { Observable, map, switchMap, tap } from 'rxjs';
import { AppFile } from '../models/app-file';
import { FileComponent } from './file/file.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ActivatedRoute } from '@angular/router';
import { getFolderById } from '../state/folder/folder.selector';
import { Folder } from '../models/folder';
import { LoadingObsName, LoadingService } from '../services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-files',
    standalone: true,
    imports: [
        CommonModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        FileComponent,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss']
})
export class FilesComponent {

    files$: Observable<AppFile[]> = this.store.select(getFiles);
    folder$: Observable<Folder | null> = this.route.paramMap.pipe(
        map((params) => parseInt(params.get('folderId'))),
        tap((folderId) => {
            this.store.dispatch(FilesActions.clearFiles());
            folderId > 0 ?
                this.store.dispatch(FilesActions.getFolderFiles({ folderId: folderId })) :
                this.store.dispatch(FilesActions.getAllFiles());
        }),
        switchMap((folderId) => this.store.select(getFolderById(folderId)))
    );
    loadingFiles$ = this.loadingService.getLoadingObs(LoadingObsName.LOADING_FILES);

    constructor(
        private store: Store,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private loadingService: LoadingService
    ) { }

    openDialog(folderId: number = null) {
        this.dialog.open(FileUploadComponent, {
            minWidth: '80vw',
            data: { folderId: folderId }
        });
    }

    deleteFile(file: AppFile) {
        this.store.dispatch(FilesActions.deleteFile({ file: file }));
    }

    viewFile(file: AppFile) {
    }

    downloadFile(file: AppFile) {
    }
}
