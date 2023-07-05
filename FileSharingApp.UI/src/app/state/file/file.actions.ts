import { createActionGroup, props } from "@ngrx/store";

export const MyFilesActions = createActionGroup({
    source: 'My Files',
    events: {
        'Upload File': props<{ file: File }>()
    }
});

export const MyFilesApiActions = createActionGroup({
    source: 'Files API',
    events: {
        'Upload File Successful': props<{ file: File }>()
    }
});