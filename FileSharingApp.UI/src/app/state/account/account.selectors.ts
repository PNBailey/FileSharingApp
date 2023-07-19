import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AccountState } from "./account.reducer";

export const accountFeatureSelector = createFeatureSelector<AccountState>('account');

export const getLoggedOnUser = createSelector(
    accountFeatureSelector,
    (state: AccountState) => state.loggedOnUser
);