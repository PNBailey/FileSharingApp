import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilesState } from "./file.reducer";

export const filesFeatureSelector = createFeatureSelector<FilesState>('files');

export const getAllFiles = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.files
);