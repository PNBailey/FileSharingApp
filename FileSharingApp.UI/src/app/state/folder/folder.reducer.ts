import { createReducer, on } from "@ngrx/store";
import { Folder } from "src/app/models/folder";
import { FolderApiActions } from "./folder.actions";

export interface FolderState {
    folders: Folder[];
}

export const initialState: FolderState = {
    folders: []
}

export const folderReducer = createReducer(
    initialState,
    on(FolderApiActions.addNewFolderSuccessful, (state, payload) => ({ ...state, folders: [...state.folders, payload.folder] })),
    on(FolderApiActions.getAllFoldersSuccessful, (state, payload) => ({ ...state, ...payload.folders }))
)