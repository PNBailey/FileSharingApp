import { Folder } from "./folder";

export class FileSearchParams {
    name: string;
    description: string;
    folder: Folder;
    constructor(name: string = null, description: string = null, folder: Folder = null) {
        this.name = name;
        this.description = description;
        this.folder = folder;
    }
}