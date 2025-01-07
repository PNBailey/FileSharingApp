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
import { Observable, combineLatest, debounceTime, distinctUntilChanged, filter, skip, startWith, withLatestFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilesActions } from 'src/app/state/file/file.actions';
import { getFileSearchParams, getFileTypes } from 'src/app/state/file/file.selector';
import { FileType } from 'src/app/models/file-type';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { FileSearch } from 'src/app/models/file-search';

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
        FloatLabelModule,
        MultiSelectModule,
        CalendarModule
    ],
    templateUrl: './file-search.component.html',
    styleUrl: './file-search.component.css'
})
export class FileSearchComponent {

    folders$ = this.store.select(getAllFolders);
    fileSearchForm: FormGroup;
    destroyRef = inject(DestroyRef);
    nameSearch$: Observable<string>;
    fileTypeSearch$: Observable<number>;
    folderSearch$: Observable<number>;
    lastModifiedRangeSearch$: Observable<Date[] | undefined>;
    fileTypes$: Observable<FileType[]> = this.store.select(getFileTypes);
    existingFileSearchParams$: Observable<FileSearch> = this.store.select(getFileSearchParams);

    constructor(private store: Store, private fb: FormBuilder) {
        this.initializeForm();
        this.setSelectedFolder();
        this.modifyNameFormControlSubscription();
        this.modifyFileTypeFormControlSubscription();
        this.modifyFolderFormControlSubscription();
        this.modifyLastModifiedRangeFormControlSubscription();
        this.subscribeToFormChanges();
        this.store.dispatch(FilesActions.getFileTypes());
    }

    private subscribeToFormChanges() {
        combineLatest([this.nameSearch$, this.fileTypeSearch$, this.folderSearch$, this.lastModifiedRangeSearch$]).pipe(
            takeUntilDestroyed(this.destroyRef),
            withLatestFrom(this.existingFileSearchParams$),
            skip(1)
        ).subscribe(([newSearchParams, existingSearchParams]) => {
            const [name, fileTypeId, folderId, lastModifiedRange] = newSearchParams;
            this.store.dispatch(FilesActions.searchFiles({
                searchParams: new FileSearch({
                    ...existingSearchParams,
                    name,
                    fileTypeId,
                    folderId,
                    lastModifiedStartDate: lastModifiedRange && lastModifiedRange[0] ? lastModifiedRange[0].toLocaleDateString("en-GB") : null,
                    lastModifiedEndDate: lastModifiedRange && lastModifiedRange[1] ? lastModifiedRange[1].toLocaleDateString("en-GB") : null
                })
            }));
        });
    }

    private modifyFolderFormControlSubscription() {
        this.folderSearch$ = this.fileSearchForm.controls['folder'].valueChanges.pipe(
            startWith(null)
        );
    }

    private modifyFileTypeFormControlSubscription() {
        this.fileTypeSearch$ = this.fileSearchForm.controls['fileType'].valueChanges.pipe(
            startWith(null)
        );
    }

    private modifyLastModifiedRangeFormControlSubscription() {
        this.lastModifiedRangeSearch$ = this.fileSearchForm.controls['lastModifiedRange'].valueChanges.pipe(
            filter(lastModifiedRange => !lastModifiedRange || (lastModifiedRange[0] && lastModifiedRange[1])),
            startWith([])
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
            "fileType": [null],
            "folder": [null],
            "lastModifiedRange": [[]]
        });
    }
}
