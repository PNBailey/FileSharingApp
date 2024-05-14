import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilesState } from "./file.reducer";

export const filesFeatureSelector = createFeatureSelector<FilesState>('files');

export const getFiles = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.files
);