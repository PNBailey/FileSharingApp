import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilesState } from "./file.reducer";
import { AppFile } from "src/app/models/app-file";

export const filesFeatureSelector = createFeatureSelector<FilesState>('files');

export const getFiles = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.files
);

export const getTotalFiles = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.totalFiles
);

export const getFileTypes = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.fileTypes
);

export const getFileSearchParams = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.fileSearch
);