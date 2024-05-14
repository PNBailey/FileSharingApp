import { TreeNode } from "primeng/api";
import { Folder } from "./folder";

export class FolderNode implements TreeNode {
    data: Folder;
    children?: FolderNode[];
    leaf?: boolean;
    expanded?: boolean;
    parent?: FolderNode;
    key?: string;
    label?: string;
    icon: string;

    constructor(data: Folder) {
        this.key = data.id.toString();
        this.label = data.name;
        this.data = data;
        this.leaf = !data.subFolders || data.subFolders.length === 0;
        this.children = data.subFolders ? data.subFolders.map(subFolder => new FolderNode(subFolder)) : [];
        this.icon = 'pi pi-fw pi-folder';
        this.label = data.name;
    }
}
