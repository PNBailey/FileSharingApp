import { NgIf, AsyncPipe, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppFile } from 'src/app/models/app-file';
import { getAllFolders } from 'src/app/state/folder/folder.selector';
import { LoadingBoolName } from 'src/app/state/loading/loading.reducer';
import { getLoadingBool } from 'src/app/state/loading/loading.selector';

@Component({
    selector: 'app-file-view',
    standalone: true,
    imports: [
        MatCardModule,
        NgIf,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatDividerModule,
        MatTabsModule,
        MatIconModule,
        AsyncPipe,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatSelectModule,
        NgFor,
        MatButtonModule
    ],
    templateUrl: './file-view.component.html',
    styleUrl: './file-view.component.css'
})
export class FileViewComponent {

    appFileForm: FormGroup;
    folders$: Observable<any> = this.store.select(getAllFolders);
    updatingFile$ = this.store.select(getLoadingBool(LoadingBoolName.UPDATING_FILE)).pipe(
        tap((isUpdating) => {
            if (!isUpdating && this.appFileForm.dirty) {
                this.dialogRef.close(null);
            }
        })
    );

    constructor(
        private fb: FormBuilder,
        private store: Store,
        public dialogRef: MatDialogRef<FileViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { file: AppFile }
    ) {
        this.appFileForm = this.fb.group({
            "name": [{ value: this.data.file.name, disabled: true }, [Validators.required, Validators.maxLength(1000)]],
            "description": [{ value: this.data.file.description, disabled: true }, [Validators.maxLength(1000)]],
            "folderId": [this.data.file.folderId]
        });
    }

    cancel() {
        this.dialogRef.close(null);
    }

    confirm() {
        this.dialogRef.close(this.appFileForm.value);
    }
}