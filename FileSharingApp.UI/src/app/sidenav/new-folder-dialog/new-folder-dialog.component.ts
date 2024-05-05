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

@Component({
    selector: 'app-new-folder-dialog',
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
        MatButtonModule
    ],
    templateUrl: './new-folder-dialog.component.html',
    styleUrls: ['./new-folder-dialog.component.css']
})
export class NewFolderDialogComponent {

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<NewFolderDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { folders: Observable<Folder[]> }
    ) {
        this.buildForm();
    }

    buildForm() {
        this.form = this.fb.group({
            'name': this.fb.control('', Validators.required),
            'description': this.fb.control('', Validators.required),
            'parentFolderId': this.fb.control(null)
        })
    }

    cancel() {
        this.dialogRef.close(null);
    }

    confirm() {
        this.dialogRef.close(this.form.value);
    }
}
