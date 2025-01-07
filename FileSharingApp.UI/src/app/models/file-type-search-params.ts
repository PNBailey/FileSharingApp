import { Folder } from "./folder";

export class FileTypeSearchParams {
    name: string;
    folder: Folder;
    constructor(name: string = null, folder: Folder = null) {
        this.name = name;
        this.folder = folder;
    }
}