import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LoadingBoolName, LoadingState } from "./loading.reducer";

export const loadingFeatureSelector = createFeatureSelector<LoadingState>('loading');

export const getLoadingBool = (loadingBoolName: LoadingBoolName) => createSelector(
    loadingFeatureSelector,
    (state: LoadingState) => state.loadingBools.get(loadingBoolName)
);