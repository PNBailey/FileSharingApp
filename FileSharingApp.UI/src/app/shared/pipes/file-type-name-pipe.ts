import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileTypeName',
    standalone: true
})
    
export class FileTypeNamePipe implements PipeTransform {

    transform(fileTypeName: string) {
        return fileTypeName.replace('File', '');
    }
}