interface FileSearchParams {
    name?: string;
    fileTypeId?: number;
    folderId?: number;
    lastModifiedStartDate?: string;
    lastModifiedEndDate?: string;
    previousRows?: number;
    nextRows?: number;
    sortField?: string;
    sortOrder?: number;
}

export class FileSearch {
    name: string;
    fileTypeId: number;
    folderId: number;
    lastModifiedStartDate: string;
    lastModifiedEndDate: string;
    previousRows: number;
    nextRows: number;
    sortField: string;
    sortOrder: number;
    constructor({ name = null, fileTypeId = null, folderId = null, lastModifiedStartDate = null, lastModifiedEndDate = null, previousRows = 0, nextRows = 10, sortField = "name", sortOrder = 1 }: FileSearchParams) {
        this.name = name;
        this.fileTypeId = fileTypeId;
        this.folderId = folderId;
        this.lastModifiedStartDate = lastModifiedStartDate;
        this.lastModifiedEndDate = lastModifiedEndDate;
        this.previousRows = previousRows;
        this.nextRows = nextRows;
        this.sortField = sortField;
        this.sortOrder = sortOrder;
    }
}