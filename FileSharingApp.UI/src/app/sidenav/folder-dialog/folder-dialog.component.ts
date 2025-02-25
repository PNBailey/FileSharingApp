import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Folder } from 'src/app/models/folder';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { ValidationService } from 'src/app/services/validation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { getLoadingBool } from 'src/app/state/loading/loading.selector';
import { LoadingBoolName } from 'src/app/state/loading/loading.reducer';
import { FolderActions } from 'src/app/state/folder/folder.actions';
import { getAllFolders } from 'src/app/state/folder/folder.selector';

@Component({
    selector: 'app-folder-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './folder-dialog.component.html',
    styleUrls: ['./folder-dialog.component.scss']
})
export class FolderDialogComponent {

    form: FormGroup;
    checkingFolderName$ = this.store.select(getLoadingBool(LoadingBoolName.CHECKING_FOLDERNAME));
    folders$: Observable<Folder[]> = this.store.select(getAllFolders);

    constructor(
        private fb: FormBuilder,
        private validationService: ValidationService,
        private store: Store,
        public dialogRef: MatDialogRef<FolderDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { folderToUpdate: Folder }
    ) {
        this.buildForm();
    }

    buildForm() {
        this.form = this.fb.group({
            'name': this.fb.control(this.data.folderToUpdate?.name, Validators.required, this.validationService.uniqueFolderValidatorFn()),
            'description': this.fb.control(this.data.folderToUpdate?.description),
            'parentFolderId': this.fb.control(this.data.folderToUpdate?.parentFolderId)
        })
    }

    cancel() {
        this.dialogRef.close(null);
    }

    confirm() {
        const folderToUpdate = {
            ...this.data.folderToUpdate,
            ...this.form.value
        }
        this.dialogRef.close(folderToUpdate);
    }

    delete() {
        this.store.dispatch(FolderActions.deleteFolder({ folderId: this.data.folderToUpdate.id }));
        this.dialogRef.close(null);
    }
}
