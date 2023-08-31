import { AccountState } from "./account/account.reducer";
import { FilesState } from "./file/file.reducer";
import { FolderState } from "./folder/folder.reducer";

export interface AppState {
    account: AccountState,
    files: FilesState,
    folders: FolderState
}