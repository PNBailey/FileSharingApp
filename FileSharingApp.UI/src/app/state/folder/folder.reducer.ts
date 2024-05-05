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
    on(FolderApiActions.addNewFolderSuccessful, (state, { folder }) => addNewFolder(state, folder)),
    on(FolderApiActions.getAllFoldersSuccessful, (state, { folders }) => ({ ...state, folders }))
);

function addNewFolder(state: FolderState, newFolder: Folder): FolderState {
    const updatedFolders = newFolder.parentFolderId ? addFolderToParentSubfolders(state, newFolder) : [...state.folders];
    return {
        ...state,
        folders: [...updatedFolders, newFolder]
    };
}

function addFolderToParentSubfolders(state: FolderState, newFolder: Folder): Folder[] {
    return state.folders.map(folder => {
        if (folder.id === newFolder.parentFolderId) {
            const subFolders = folder.subFolders || [];
            return {
                ...folder,
                subFolders: [...subFolders, newFolder]
            };
        }
        return folder;
    });
}
