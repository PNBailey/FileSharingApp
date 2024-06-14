import { Component, DestroyRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAllFolders, getSelectedFolder } from 'src/app/state/folder/folder.selector';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, NgFor } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Folder } from 'src/app/models/folder';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileSearchParams } from 'src/app/models/file-search-params';
import { FilesActions } from 'src/app/state/file/file.actions';

@Component({
    selector: 'app-file-search',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        AsyncPipe,
        NgFor,
        InputTextModule,
        DropdownModule,
        FloatLabelModule

    ],
    templateUrl: './file-search.component.html',
    styleUrl: './file-search.component.css'
})
export class FileSearchComponent {

    folders$ = this.store.select(getAllFolders);
    fileSearchForm: FormGroup;
    destroyRef = inject(DestroyRef);
    nameSearch$: Observable<string>;
    descriptionSearch$: Observable<string>;
    folderSearch$: Observable<Folder>;
    searchParams: FileSearchParams;

    constructor(private store: Store, private fb: FormBuilder) {
        this.initializeForm();
        this.setSelectedFolder();
        this.modifyNameFormControlSubscription();
        this.modifyDescriptionFormControlSubscription();
        this.modifyFolderFormControlSubscription();
        this.subscribeToFormChanges();
    }

    private subscribeToFormChanges() {
        combineLatest([this.nameSearch$, this.descriptionSearch$, this.folderSearch$]).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(([name, description, folder]) => {
            this.store.dispatch(FilesActions.getFiles({ searchParams: new FileSearchParams(name, description, folder) }));
        });
    }

    private modifyFolderFormControlSubscription() {
        this.folderSearch$ = this.fileSearchForm.controls['folder'].valueChanges.pipe(
            startWith(null)
        );
    }

    private modifyDescriptionFormControlSubscription() {
        this.descriptionSearch$ = this.fileSearchForm.controls['description'].valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            startWith(null)
        );
    }

    private modifyNameFormControlSubscription() {
        this.nameSearch$ = this.fileSearchForm.controls['name'].valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            startWith(null)
        );
    }

    private setSelectedFolder() {
        this.store.select(getSelectedFolder).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(selectedFolder => {
            this.fileSearchForm.controls['folder'].setValue(selectedFolder);
        });
    }

    private initializeForm() {
        this.fileSearchForm = this.fb.group({
            "name": [''],
            "description": [''],
            "folder": [null],
        });
    }

}
