import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Folder } from "src/app/models/folder";

export const FolderActions = createActionGroup({
    source: 'New Folder Dialog',
    events: {
        'Add New Folder': props<{ folder: Folder }>(),
        'Get All Folders': emptyProps()
    }
});

export const FolderApiActions = createActionGroup({
    source: 'New Folder Dialog',
    events: {
        'Add New Folder Successful': emptyProps(),
        'Add New Folder Unsuccessful': emptyProps(),
        'Get All Folders Successful': props<{ folders: Folder[] }>(),
        'Get All Folders Unsuccessful': emptyProps()
    }
});