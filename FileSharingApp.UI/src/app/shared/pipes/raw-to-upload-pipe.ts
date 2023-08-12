import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rawToUpload',
    standalone: true
})
    
export class RawToUploadPipe implements PipeTransform {

    transform(url: string) {
        return url.replace('raw', 'image');
    }
}