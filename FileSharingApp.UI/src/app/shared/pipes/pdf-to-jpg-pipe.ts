import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pdfToJpg',
    standalone: true
})
    
export class PdfToJpgPipe implements PipeTransform {

    transform(url: string) {
        return url.replace('.pdf', '.jpg');
    }
}