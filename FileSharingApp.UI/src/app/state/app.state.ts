import { AccountState } from "./account/account.reducer";
import { FileState } from "./file/file.reducer";

export interface AppState {
    account: AccountState,
    files: FileState
}