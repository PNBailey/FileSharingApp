import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AppFile } from "src/app/models/app-file";

export const MyFilesActions = createActionGroup({
    source: 'My Files',
    events: {
        'Upload File': props<{ file: File }>(),
        'Get All Files': emptyProps()
    }
});

export const MyFilesApiActions = createActionGroup({
    source: 'Files API',
    events: {
        'Upload File Successful': props<{ file: AppFile }>(),
        'Get Files Successful': props<{files: AppFile[]}>()
    }
});