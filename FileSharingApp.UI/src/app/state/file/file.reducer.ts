import { createReducer, on } from "@ngrx/store";
import { FilesActions, FilesApiActions } from "./file.actions";
import { AppFile } from "src/app/models/app-file";

export interface FilesState {
    files: AppFile[];
}

export const initialState: FilesState = {
    files: []
}

export const fileReducer = createReducer(
    initialState,
    on(FilesApiActions.uploadFilesSuccessful, (state, payload) => ({ ...state, files: [...state.files, ...payload.files] })),
    on(FilesApiActions.getFilesSuccessful, (state, payload) => ({ ...state, files: payload.files })),
    on(FilesActions.clearFiles, () => initialState)
)