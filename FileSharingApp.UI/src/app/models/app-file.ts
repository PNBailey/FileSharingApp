import { FileType } from "./file-type";
import { Folder } from "./folder";

export class AppFile {
    id: number;
    name: string;
    description: string;
    fileTypeName: string;
    fileType: FileType;
    originalFile: File;
    size: number;
    url: string;
    lastModified: Date;
    downloadUrl: string;
    folder: Folder;
    folderId: number;
    isHovered = false;
}