import { Component, DestroyRef, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { FilesActions } from '../state/file/file.actions';
import { Observable } from 'rxjs';
import { AppFile } from '../models/app-file';
import { FileComponent } from './file/file.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileViewComponent } from './file-view/file-view.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileSearchComponent } from './file-search/file-search.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextLengthPipe } from '../shared/pipes/text-length-pipe';
import { environment } from 'src/environments/environment';
import { FileSearch } from '../models/file-search';
import { getFileSearchParams, getFiles, getTotalFiles } from '../state/file/file.selector';
import { LazyLoadEvent } from 'primeng/api';
import { getLoadingBool } from '../state/loading/loading.selector';
import { LoadingBoolName } from '../state/loading/loading.reducer';

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
    destroyRef = inject(DestroyRef);
    files$: Observable<AppFile[]> = this.store.select(getFiles);
    totalFiles$: Observable<number> = this.store.select(getTotalFiles);
    // loadingFiles$ = this.loadingService.getLoadingObs(LoadingObsName.LOADING_FILES);
    loadingFiles$ = this.store.select(getLoadingBool(LoadingBoolName.LOADING_FILES));
    deletingFile$: Observable<boolean>;
    existingFileSearchParams: FileSearch;

    constructor(
        private store: Store,
        public dialog: MatDialog,
        private renderer: Renderer2
    ) {
        this.store.select(getFileSearchParams)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(existingFileSearch => {
                this.existingFileSearchParams = existingFileSearch;
            })
    }

    openFileUploadDialog() {
        this.dialog.open(FileUploadComponent, {
            minWidth: '80vw',
        });
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
                    this.store.dispatch(FilesActions.updateFile({
                        file: {
                            ...file,
                            ...updatedFile
                        }
                    }));
                }
            })
    }

    deleteFile(file: AppFile) {
        this.store.dispatch(FilesActions.deleteFile({ file: file }));
    }

    downloadFile(file: AppFile) {
        if (file && file.downloadUrl) {
            const link = document.createElement('a');
            link.href = `${environment.baseUrl}/File/DownloadFile/${file.name}`;
            this.renderer.appendChild(document.body, link);
            link.click();
            this.renderer.removeChild(document.body, link);
        }
    }

    paginateOrSort(event: LazyLoadEvent) {
        this.store.dispatch(FilesActions.searchFiles({
            searchParams: new FileSearch({
                ...this.existingFileSearchParams,
                sortField: event.sortField,
                sortOrder: event.sortOrder,
                previousRows: event.first,
                nextRows: event.rows
            })
        }));
    }
}
