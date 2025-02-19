import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Folder } from "src/app/models/folder";

export const FolderActions = createActionGroup({
    source: 'Folders',
    events: {
        'Add New Folder': props<{ folder: Folder }>(),
        'Edit Folder': props<{ folder: Folder }>(),
        'Get All Folders': emptyProps(),
        'Clear Folders': emptyProps(),
        'Change Folder Parent': props<{ folderId: number, parentFolderId: number }>(),
        'Get Folder By Id': props<{ selectedFolderId: number }>(),
        'Delete Folder': props<{ folderId: number }>()
    }
});

export const FolderApiActions = createActionGroup({
    source: 'Folder API',
    events: {
        'Add New Folder Successful': emptyProps(),
        'Edit Folder Successful': emptyProps(),
        'Get All Folders Successful': props<{ folders: Folder[] }>(),
        'Change Folder Parent Successful': emptyProps(),
        'Delete Folder Successful': emptyProps(),
    }
});