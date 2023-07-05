import { createReducer, on } from "@ngrx/store";
import { MyFilesApiActions } from "./file.actions";

export interface FileState {
    files: File[];
}

export const initialState: FileState = {
    files: []
}

export const fileReducer = createReducer(
    initialState,
    on(MyFilesApiActions.uploadFileSuccessful, (state, payload) => ({...state, files: [...state.files, payload.file]}))
)