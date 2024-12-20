import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilesState } from "./file.reducer";
import { AppFile } from "src/app/models/app-file";

export const filesFeatureSelector = createFeatureSelector<FilesState>('files');

export const getFiles = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.files.map(file => Object.assign(new AppFile(), file))
);

export const getFileTypes = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.fileTypes
);

export const getFileSearchParams = createSelector(
    filesFeatureSelector,
    (state: FilesState) => state.fileSearchParams
);