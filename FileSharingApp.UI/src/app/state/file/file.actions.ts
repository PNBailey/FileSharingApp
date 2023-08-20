import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AppFile } from "src/app/models/app-file";

export const MyFilesActions = createActionGroup({
    source: 'My Files',
    events: {
        'Upload Files': props<{ files: File[] }>(),
        'Get All Files': emptyProps()
    }
});

export const MyFilesApiActions = createActionGroup({
    source: 'Files API',
    events: {
        'Upload Files Successful': props<{ files: AppFile[] }>(),
        'Upload Files Unsuccessful': emptyProps(),
        'Get Files Successful': props<{ files: AppFile[]} >()
    }
});