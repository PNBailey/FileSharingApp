import { FileType } from "./file-type";
import { Folder } from "./folder";

export class AppFile {
    id: number;
    name: string;
    description: string;
    fileType: FileType;
    originalFile: File;
    size: number;
    lastModified: Date;
    downloadUrl: string;
    folder: Folder;
    folderId: number;
    isHovered = false;
    isUploading = false;
    hasUploaded = false;
}