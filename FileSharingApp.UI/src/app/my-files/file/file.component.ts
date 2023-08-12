import { AfterViewInit, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppFile } from 'src/app/models/app-file';
import { SafePipe } from 'src/app/shared/pipes/safe-pipe';
import { RawToUploadPipe } from 'src/app/shared/pipes/raw-to-upload-pipe';
import { MatDividerModule } from '@angular/material/divider';
import { FileTypeNamePipe } from 'src/app/shared/pipes/file-type-name-pipe';
import { FileNamePipe } from 'src/app/shared/pipes/file-name-pipe';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    SafePipe,
    RawToUploadPipe,
    MatDividerModule,
    FileTypeNamePipe,
    FileNamePipe
  ],
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements AfterViewInit {
  @Input() file: AppFile;
  
  ngAfterViewInit(): void {
    
    console.log(this.file);
  }

}
