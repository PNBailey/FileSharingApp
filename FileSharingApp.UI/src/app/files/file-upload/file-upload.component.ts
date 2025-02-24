import { Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FilesActions } from 'src/app/state/file/file.actions';
import { getFileSearchParams } from 'src/app/state/file/file.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppFile } from 'src/app/models/app-file';
import { FileSearch } from 'src/app/models/file-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getLoadingBool } from 'src/app/state/loading/loading.selector';
import { LoadingBoolName } from 'src/app/state/loading/loading.reducer';
import { take } from 'rxjs';

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [
        CommonModule,
        NgxFileDropModule,
        MatDialogModule,
        MatButtonModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
    public filesToUpload: File[] = [];
    public columnNames = ['name', 'file type', 'file size', 'last updated', 'delete'];
    @ViewChild(MatTable) table: MatTable<File>;
    destroyRef = inject(DestroyRef);
    uploadingFilesSub$ = this.store.select(getLoadingBool(LoadingBoolName.UPLOADING_FILES));
    uploadingFiles: boolean;

    constructor(
        private store: Store,
        private dialog: MatDialog
    ) {
        this.uploadingFilesSub$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((value) => {
            if (this.uploadingFiles != null && !value) {
                this.dialog.closeAll();
            }
            this.uploadingFiles = value;
        })
    }

    public onFileDropped(files: NgxFileDropEntry[]) {
        for (const droppedFile of files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    this.filesToUpload.push(file);
                    this.table.renderRows();
                });
            }
        }
    }

    public onFileSelected(event: Event) {
        const eventTarget = event.target as HTMLInputElement;
        if (!eventTarget.files?.length) {
            return;
        }
        this.filesToUpload = Array.from(eventTarget.files);
        this.table.renderRows();
    }

    public removeFile(fileToRemove: File) {
        this.filesToUpload = this.filesToUpload.filter(file => file !== fileToRemove);
        this.table.renderRows();
    }

    public uploadFiles() {
        this.store.select(getFileSearchParams).pipe(
            take(1)
        ).subscribe(searchParams => {
            const filesToUploadMapped = this.filesToUpload.map(file => {
                const appFile = new AppFile();
                appFile.name = file.name;
                appFile.size = file.size;
                appFile.lastModified = new Date(file.lastModified);
                appFile.originalFile = file;
                appFile.folderId = searchParams.folderId;
                return appFile;
            });
            this.store.dispatch(FilesActions.uploadFiles({ files: filesToUploadMapped }));
        });
    }
}
