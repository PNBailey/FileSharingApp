import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingService } from 'src/app/services/loading.service';
import { Observable } from 'rxjs';

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
        NgOptimizedImage,
        MatButtonModule,
        MatTooltipModule
    ],
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss'],
    animations: [
        trigger('overlayAnimation', [
            state('void', style({
                opacity: 0
            })),
            state('*', style({
                opacity: 0.6,
                backgroundColor: 'black'
            })),
            transition('void <=> *', animate('200ms ease-in-out'))
        ]),
        trigger('iconButtonsAnimation', [
            state('void', style({
                transform: 'translateY(100%)'
            })),
            state('*', style({
                transform: 'translateY(0)'
            })),
            transition('void <=> *', animate('200ms ease-in-out'))
        ])
    ]
})
export class FileComponent implements AfterViewInit {

    isHovered: boolean = false;
    imageHasLoaded = false;
    deletingFile$: Observable<boolean>;
    @Input() file: AppFile;
    @Output() deleteFileEvent = new EventEmitter<AppFile>();
    @Output() viewFileEvent = new EventEmitter<AppFile>();
    @Output() downloadFileEvent = new EventEmitter<AppFile>();

    constructor(private loadingService: LoadingService) { }

    ngAfterViewInit(): void {
        this.deletingFile$ = this.loadingService.getLoadingObs(this.file.name);
    }

    deleteFile() {
        this.deleteFileEvent.emit(this.file);
    }

    viewFile() {
        this.viewFileEvent.emit(this.file);
    }

    downloadFile() {
        const link = document.createElement('a');
        link.href = this.file.downloadUrl;
        link.setAttribute('download', this.file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
