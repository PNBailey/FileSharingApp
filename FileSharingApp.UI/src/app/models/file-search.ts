import { FileType } from "./file-type";
import { Folder } from "./folder";

interface FileSearchParams {
    name?: string;
    fileType?: FileType;
    folder?: Folder;
    lastModifiedStartDate?: string;
    lastModifiedEndDate?: string;
    previousRows?: number;
    nextRows?: number;
    sortField?: string;
    sortOrder?: number;
}

export class FileSearch {
    name: string;
    fileType: FileType;
    folder: Folder;
    lastModifiedStartDate: string;
    lastModifiedEndDate: string;
    previousRows: number;
    nextRows: number;
    sortField: string;
    sortOrder: number;
    constructor({ name = null, fileType = null, folder = null, lastModifiedStartDate = null, lastModifiedEndDate = null, previousRows = 0, nextRows = 10, sortField = "name", sortOrder = 1 }: FileSearchParams) {
        this.name = name;
        this.fileType = fileType;
        this.folder = folder;
        this.lastModifiedStartDate = lastModifiedStartDate;
        this.lastModifiedEndDate = lastModifiedEndDate;
        this.previousRows = previousRows;
        this.nextRows = nextRows;
        this.sortField = sortField;
        this.sortOrder = sortOrder;
    }
}