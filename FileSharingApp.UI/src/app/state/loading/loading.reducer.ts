import { createReducer, on } from "@ngrx/store";
import { LoadingActions } from "./loading.actions";

export enum LoadingBoolName {
    UPDATING_PROFILE = 'updatingProfile$',
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