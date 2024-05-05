import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textLength',
    standalone: true
})

export class TextLengthPipe implements PipeTransform {
    transform(text: string, maxLength: number) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        } else {
            return text;
        }
    }
}