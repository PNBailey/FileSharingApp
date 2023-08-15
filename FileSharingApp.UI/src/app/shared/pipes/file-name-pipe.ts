import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileName',
    standalone: true
})
    
export class FileNamePipe implements PipeTransform {

    transform(fileName: string) {
        if (fileName.length > 19) {
            return fileName.replace(fileName.substring(18, fileName.length), '...');
        } else {
            return fileName;
        }
    }
}