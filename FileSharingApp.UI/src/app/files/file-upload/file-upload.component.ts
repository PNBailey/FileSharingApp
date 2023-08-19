import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { Store } from '@ngrx/store';
import { MyFilesActions } from 'src/app/state/file/file.actions';
import { AppFile } from 'src/app/models/app-file';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    NgxFileDropModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  public filesToUpload: File[] = [];
  public columnNames = ['name', 'description', 'file type', 'last updated', 'delete'];

  constructor(private store: Store) {}

  public onFileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.filesToUpload.push(file);
        });
      }
    }
  }

  public onFileSelected(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.files?.length) {
      return;
    }    
    // this.store.dispatch(MyFilesActions.uploadFile({ file: eventTarget.files[0] }))
    this.filesToUpload.push(eventTarget.files[0]);
    console.log(this.filesToUpload);
    
  }
}
