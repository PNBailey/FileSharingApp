import { AccountState } from "./account/account.reducer";
import { FilesState } from "./file/file.reducer";

export interface AppState {
    account: AccountState,
    files: FilesState
}