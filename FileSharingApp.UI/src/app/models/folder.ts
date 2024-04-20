import { User } from "./user";

export class Folder {
    id: number;
    name: string;
    description: string;
    folderOwner: User;
    parentFolder: Folder;
}