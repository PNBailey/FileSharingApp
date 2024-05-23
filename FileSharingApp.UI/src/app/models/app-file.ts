import { Folder } from "./folder";

export class AppFile {
    id: number;
    name: string;
    description: string;
    fileTypeName: string;
    url: string;
    lastUpdated: Date;
    downloadUrl: string;
    folder: Folder;
    folderId: number;
}