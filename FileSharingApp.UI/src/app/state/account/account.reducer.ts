import { createReducer, on } from "@ngrx/store";
import { User } from "src/app/models/user";
import { AccountApiActions, AccountAppCompActions } from "./account.actions";

export interface AccountState {
    loggedOnUser: User | null;
}

export const initialState: AccountState = {
    loggedOnUser: null
}

export const accountReducer = createReducer(
    initialState,
    on(AccountAppCompActions.logout, state => ({...state, loggedOnUser: null})),
    on(AccountApiActions.setLoggedOnUser, (state, payload) => ({...state, loggedOnUser: payload.user}))
)