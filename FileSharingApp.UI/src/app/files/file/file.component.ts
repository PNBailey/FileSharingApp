import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppFile } from 'src/app/models/app-file';
import { SafePipe } from 'src/app/shared/pipes/safe-pipe';
import { RawToImagePipe } from 'src/app/shared/pipes/raw-to-image-pipe';
import { MatDividerModule } from '@angular/material/divider';
import { FileTypeNamePipe } from 'src/app/shared/pipes/file-type-name-pipe';
import { TextLengthPipe } from 'src/app/shared/pipes/text-length-pipe';
import { PdfToJpgPipe } from 'src/app/shared/pipes/pdf-to-jpg-pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-file',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        SafePipe,
        RawToImagePipe,
        MatDividerModule,
        FileTypeNamePipe,
        TextLengthPipe,
        PdfToJpgPipe,
        MatProgressSpinnerModule,
        NgOptimizedImage
    ],
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss']
})
export class FileComponent {
    imageHasLoaded = false;
    @Input() file: AppFile;
}
