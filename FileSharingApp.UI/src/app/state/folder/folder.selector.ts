import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FolderState } from "./folder.reducer";

export const foldersFeatureSelector = createFeatureSelector<FolderState>('folders');

export const getAllFolders = createSelector(
    foldersFeatureSelector,
    (state: FolderState) => state.folders
);