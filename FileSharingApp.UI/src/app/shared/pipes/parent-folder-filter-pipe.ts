import { Pipe, PipeTransform } from '@angular/core';
import { Folder } from 'src/app/models/folder';

@Pipe({
    name: 'parentFolderFilter',
    standalone: true
})

export class ParentFolderFilterPipe implements PipeTransform {

    transform(folders: Folder[]) {
        return folders.filter(f => !f.parentFolderId);
    }
}