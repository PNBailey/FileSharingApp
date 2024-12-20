import { FileType } from "./file-type";
import { Folder } from "./folder";

export class FileSearchParams {
    name: string;
    fileType: FileType;
    folder: Folder;
    lastModifiedRange: Date[];
    constructor(name: string = null, fileType: FileType = null, folder: Folder = null, lastModifiedRange: Date[] = []) {
        this.name = name;
        this.fileType = fileType;
        this.folder = folder;
        this.lastModifiedRange = lastModifiedRange;
    }
}