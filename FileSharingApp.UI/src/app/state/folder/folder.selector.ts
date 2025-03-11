import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FolderState } from "./folder.reducer";

export const foldersFeatureSelector = createFeatureSelector<FolderState>('folders');

export const getAllFolders = createSelector(
    foldersFeatureSelector,
    (state: FolderState) => state.folders
);

export const getFolderById = (folderId: number) => createSelector(
    foldersFeatureSelector,
    (state: FolderState) => state.folders.find(f => f.id == folderId)
);

export const getTopLevelFolder = createSelector(
    foldersFeatureSelector,
    (state: FolderState) => state.folders[0]
);