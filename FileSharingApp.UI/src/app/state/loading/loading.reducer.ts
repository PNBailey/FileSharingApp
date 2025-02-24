import { createReducer, on } from "@ngrx/store";
import { LoadingActions } from "./loading.actions";

export enum LoadingBoolName {
    CHECKING_EMAIL = 'checkingEmail$',
    CHECKING_USERNAME = 'checkingUsername$',
    UPDATING_PROFILE = 'updatingProfile$',
    CHECKING_FOLDERNAME = 'checkingFolderName$',
    LOADING_FILES = 'loadingFiles$',
    LOADING_FOLDERS = 'loadingFolders$',
    UPDATING_FILE = 'updatingFile$',
    UPLOADING_FILES = 'uploadingFiles$'
}

export interface LoadingState {
    loadingBools: Map<LoadingBoolName | string, boolean>;
}

export const initialState: LoadingState = {
    loadingBools: new Map()
}

export const loadingReducer = createReducer(
    initialState,
    on(LoadingActions.toggleLoading, (state, { loadingBoolName }) => {
        const loadingBoolVal = !state.loadingBools.get(loadingBoolName) ?? false;
        state.loadingBools.set(loadingBoolName, loadingBoolVal);
        return {
            ...state
        }
    }),
);