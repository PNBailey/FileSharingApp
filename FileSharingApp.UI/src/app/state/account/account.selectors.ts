import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { AccountState } from "./account.reducer";

export const selectAccount = (state: AppState) => state.account;

export const selectAccountLoggedOnUser = createSelector(
    selectAccount,
    (state: AccountState) => state.loggedOnUser
);