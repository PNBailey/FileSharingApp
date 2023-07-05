import { createSelector } from "@ngrx/store";
import { AccountState } from "./account.reducer";

export const selectAccountState = (state: AccountState) => state;

export const selectAccountLoggedOnUser = createSelector(
    selectAccountState,
    (state: AccountState) => state.loggedOnUser
);