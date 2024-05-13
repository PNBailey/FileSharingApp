import { Pipe, PipeTransform } from '@angular/core';
import { Folder } from 'src/app/models/folder';
import { FolderNode } from 'src/app/models/folder-node';

@Pipe({
    name: 'convertToFolderNodes',
    standalone: true
})

export class ConvertToFolderNodesPipe implements PipeTransform {

    transform(folders: Folder[]) {
        return folders.map(folder => new FolderNode(folder));
    }
}