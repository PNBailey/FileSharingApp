import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FolderState } from "./folder.reducer";

export const filesFeatureSelector = createFeatureSelector<FolderState>('folders');

export const getAllFolders = createSelector(
    filesFeatureSelector,
    (state: FolderState) => state.folders
);