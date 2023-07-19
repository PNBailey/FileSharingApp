import { createReducer, on } from "@ngrx/store";
import { MyFilesApiActions } from "./file.actions";
import { AppFile } from "src/app/models/app-file";

export interface FilesState {
    files: AppFile[];
}

export const initialState: FilesState = {
    files: []
}

export const fileReducer = createReducer(
    initialState,
    on(MyFilesApiActions.uploadFileSuccessful, (state, payload) => ({ ...state, files: [...state.files, payload.file]}))
)