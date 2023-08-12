import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rawToImage',
    standalone: true
})
    
export class RawToImagePipe implements PipeTransform {

    transform(url: string) {
        return url.replace('raw', 'image');
    }
}