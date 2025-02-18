import { Pipe, PipeTransform } from '@angular/core';
import { FolderNode } from 'src/app/models/folder-node';

@Pipe({
    name: 'parentFolderFilter',
    standalone: true
})

export class ParentFolderFilterPipe implements PipeTransform {

    transform(folderNodes: FolderNode[]) {
        return folderNodes.filter(fn => !fn.data.parentFolderId);
    }
}