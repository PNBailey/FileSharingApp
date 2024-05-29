import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AppFile } from "src/app/models/app-file";
import { FileSearchParams } from "src/app/models/file-search-params";

export const FilesActions = createActionGroup({
    source: 'Files',
    events: {
        'Upload Files': props<{ files: File[], folderId: number | null }>(),
        'Clear Files': emptyProps(),
        'Get Files': props<{ searchParams: FileSearchParams }>(),
        'Delete File': props<{ file: AppFile }>(),
        'Update File': props<{ file: AppFile }>(),
    }
});

export const FilesApiActions = createActionGroup({
    source: 'Files API',
    events: {
        'Upload Files Successful': props<{ files: AppFile[] }>(),
        'Upload Files Unsuccessful': emptyProps(),
        'Get Files Successful': props<{ files: AppFile[] }>(),
        'Get Files Unsuccessful': emptyProps(),
        'Delete File Successful': props<{ file: AppFile }>(),
        'Delete File Unsuccessful': props<{ file: AppFile }>(),
        'Update File Successful': props<{ file: AppFile }>(),
        'Update File Unsuccessful': emptyProps()
    }
});