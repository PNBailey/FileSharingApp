import { createReducer, on } from "@ngrx/store";
import { FilesActions, FilesApiActions } from "./file.actions";
import { AppFile } from "src/app/models/app-file";
import { FileSearchParams } from "src/app/models/file-search-params";
import { FileType } from "src/app/models/file-type";

export interface FilesState {
    files: AppFile[];
    fileSearchParams: FileSearchParams;
    fileTypes: FileType[];
}

export const initialState: FilesState = {
    files: [],
    fileSearchParams: new FileSearchParams(),
    fileTypes: []
}

export const fileReducer = createReducer(
    initialState,
    on(FilesApiActions.uploadFilesSuccessful, (state, payload) => ({ ...state, files: [...state.files, ...payload.files.filter(f => !state.files.some(sf => sf.name == f.name))] })),
    on(FilesActions.searchFiles, (state, payload) => ({ ...state, fileSearchParams: payload.searchParams })),
    on(FilesApiActions.getFilesSuccessful, (state, payload) => ({ ...state, files: payload.files })),
    on(FilesApiActions.getFileTypesSuccessful, (state, payload) => ({ ...state, fileTypes: payload.fileTypes })),
    on(FilesActions.clearFiles, () => initialState),
    on(FilesApiActions.deleteFileSuccessful, (state, payload) => ({ ...state, files: state.files.filter(f => f.id != payload.file.id) })),
    on(FilesApiActions.updateFileSuccessful,
        (state, payload) => ({
            ...state,
            files: state.files.map(file => file.id === payload.file.id ? payload.file : file)
        })
    )
)