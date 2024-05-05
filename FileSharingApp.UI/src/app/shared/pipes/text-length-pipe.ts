import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textLength',
    standalone: true
})

export class TextLengthPipe implements PipeTransform {

    transform(text: string, maxLength: number) {
        if (text.length > maxLength) {
            return text.replace(text.substring(maxLength - 1, text.length), '...');
        } else {
            return text;
        }
    }
}