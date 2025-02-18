import { createReducer, on } from "@ngrx/store";
import { FilesActions, FilesApiActions } from "./file.actions";
import { AppFile } from "src/app/models/app-file";
import { FileType } from "src/app/models/file-type";
import { FileSearch } from "src/app/models/file-search";

export interface FilesState {
    files: AppFile[];
    fileSearch: FileSearch;
    fileTypes: FileType[];
    totalFiles: number;
}

export const initialState: FilesState = {
    files: [],
    fileSearch: new FileSearch({}),
    fileTypes: [],
    totalFiles: 0
}

export const fileReducer = createReducer(
    initialState,
    on(FilesApiActions.uploadFilesSuccessful, (state, payload) => ({ ...state, files: [...state.files, ...payload.uploadedFiles] })),
    on(FilesActions.searchFiles, (state, payload) => ({ ...state, fileSearch: payload.searchParams })),
    on(FilesApiActions.getFilesSuccessful, (state, payload) => ({ ...state, files: payload.paginatedResponse.items, totalFiles: payload.paginatedResponse.totalRecords })),
    on(FilesApiActions.getFileTypesSuccessful, (state, payload) => ({ ...state, fileTypes: payload.fileTypes })),
    on(FilesActions.clearFiles, () => initialState),
    on(FilesApiActions.deleteFileSuccessful, (state, payload) => ({ ...state, files: state.files.filter(f => f.id != payload.file.id) }))
)