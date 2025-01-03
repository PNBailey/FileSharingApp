import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AppFile } from "src/app/models/app-file";
import { FileSearch } from "src/app/models/file-search";
import { FileType } from "src/app/models/file-type";
import { PaginatedResponse } from "src/app/models/paginated-response";

export const FilesActions = createActionGroup({
    source: 'Files',
    events: {
        'Upload Files': props<{ files: AppFile[] }>(),
        'Clear Files': emptyProps(),
        'Search Files': props<{ searchParams: FileSearch }>(),
        'Delete File': props<{ file: AppFile }>(),
        'Update File': props<{ file: AppFile }>(),
        'Get File Types': emptyProps()
    }
});

export const FilesApiActions = createActionGroup({
    source: 'Files API',
    events: {
        'Upload Files Successful': props<{ uploadedFiles: AppFile[] }>(),
        'Upload Files Unsuccessful': emptyProps(),
        'Get Files Successful': props<{ paginatedResponse: PaginatedResponse<AppFile> }>(),
        'Get Files Unsuccessful': emptyProps(),
        'Delete File Successful': props<{ file: AppFile }>(),
        'Delete File Unsuccessful': props<{ file: AppFile }>(),
        'Update File Successful': props<{ file: AppFile }>(),
        'Update File Unsuccessful': emptyProps(),
        'Get File Types Successful': props<{ fileTypes: FileType[] }>(),
        'Get File Types Unsuccessful': emptyProps()
    }
});