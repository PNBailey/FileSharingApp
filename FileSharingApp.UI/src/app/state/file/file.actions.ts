import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AppFile } from "src/app/models/app-file";

export const FilesActions = createActionGroup({
    source: 'Files',
    events: {
        'Upload Files': props<{ files: File[], folderId: number | null }>(),
        'Get All Files': emptyProps(),
        'Clear Files': emptyProps(),
        'Get Folder Files': props<{ folderId: number }>(),
        'Get Files': emptyProps()
    }
});

export const FilesApiActions = createActionGroup({
    source: 'Files API',
    events: {
        'Upload Files Successful': props<{ files: AppFile[] }>(),
        'Upload Files Unsuccessful': emptyProps(),
        'Get Files Successful': props<{ files: AppFile[] }>(),
        'Get Files Unsuccessful': emptyProps()
    }
});