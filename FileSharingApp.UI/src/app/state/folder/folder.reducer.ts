import { createReducer, on } from "@ngrx/store";
import { Folder } from "src/app/models/folder";
import { FolderActions, FolderApiActions } from "./folder.actions";

export interface FolderState {
    folders: Folder[];
    selectedFolderId: number
}

export const initialState: FolderState = {
    folders: [],
    selectedFolderId: null
}

export const folderReducer = createReducer(
    initialState,
    on(FolderApiActions.getAllFoldersSuccessful, (state, { folders }) => ({ ...state, folders })),
    on(FolderActions.clearFolders, () => initialState)
);