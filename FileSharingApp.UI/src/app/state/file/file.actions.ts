import { createActionGroup, props } from "@ngrx/store";
import { AppFile } from "src/app/models/app-file";

export const MyFilesActions = createActionGroup({
    source: 'My Files',
    events: {
        'Upload File': props<{ file: File }>()
    }
});

export const MyFilesApiActions = createActionGroup({
    source: 'Files API',
    events: {
        'Upload File Successful': props<{ file: AppFile }>()
    }
});