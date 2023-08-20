import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileName',
    standalone: true
})
    
export class FileNamePipe implements PipeTransform {

    transform(fileName: string) {
        if (fileName.length > 17) {
            return fileName.replace(fileName.substring(16, fileName.length), '...');
        } else {
            return fileName;
        }
    }
}