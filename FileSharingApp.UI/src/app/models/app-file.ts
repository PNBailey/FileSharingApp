import { FileType } from "./file-type";
import { Folder } from "./folder";

export class AppFile {
    id: number;
    name: string;
    description: string;
    fileTypeName: string;
    fileType: FileType;
    url: string;
    lastUpdated: Date;
    downloadUrl: string;
    folder: Folder;
    folderId: number;
    isHovered = false;
}