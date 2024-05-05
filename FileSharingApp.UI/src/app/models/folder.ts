import { AppFile } from "./app-file";
import { User } from "./user";

export class Folder {
    id: number;
    name: string;
    description: string;
    folderOwner: User;
    parentFolder: Folder;
    parentFolderId: number;
    subFolders: Folder[];
    files: AppFile[];
    users: User[];
}