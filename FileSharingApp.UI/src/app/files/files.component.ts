import { Component, DestroyRef, ViewChild, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { FilesActions } from '../state/file/file.actions';
import { getFileTypes, getFiles } from '../state/file/file.selector';
import { Observable, map } from 'rxjs';
import { AppFile } from '../models/app-file';
import { FileComponent } from './file/file.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { LoadingObsName, LoadingService } from '../services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileViewComponent } from './file-view/file-view.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileSearchComponent } from './file-search/file-search.component';
import { Table, TableModule } from 'primeng/table';
import { FileType } from '../models/file-type';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileSearchParams } from '../models/file-search-params';
import { TextLengthPipe } from '../shared/pipes/text-length-pipe';

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
        MatProgressSpinnerModule,
        FileSearchComponent,
        TableModule,
        MultiSelectModule,
        FormsModule,
        InputIconModule,
        IconFieldModule,
        ButtonModule,
        InputTextModule,
        TextLengthPipe
    ],
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss']
})
export class FilesComponent {
    isHovered: boolean = false;
    destroyRef = inject(DestroyRef);
    searchValue: string;
    selectedFiles: AppFile[] = [];
    files$: Observable<AppFile[]> = this.store.select(getFiles);
    loadingFiles$ = this.loadingService.getLoadingObs(LoadingObsName.LOADING_FILES);
    deletingFile$: Observable<boolean>;

    constructor(
        private store: Store,
        public dialog: MatDialog,
        private loadingService: LoadingService
    ) {
    }

    openFileUploadDialog() {
        this.dialog.open(FileUploadComponent, {
            minWidth: '80vw',
        });
    }

    deleteFile() {
        // this.store.dispatch(FilesActions.deleteFile({ file: file }));
    }

    openFileViewDialog(file: AppFile) {
        const dialogRef = this.dialog.open(FileViewComponent, {
            minWidth: '40vw',
            data: { file: file }
        });
        dialogRef.afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((updatedFile: AppFile) => {
                if (updatedFile) {
                    this.store.dispatch(FilesActions.updateFile({ file: { ...file, ...updatedFile } }));
                }
            })
    }

    viewFile() {

    }

    downloadFile() {

    }

    clear() {
        this.store.dispatch(FilesActions.searchFiles({ searchParams: new FileSearchParams() }));
    }
}
