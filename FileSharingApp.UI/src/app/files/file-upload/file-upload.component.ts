import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatTable, MatTableModule} from '@angular/material/table';
import { Store } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MyFilesActions } from 'src/app/state/file/file.actions';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    NgxFileDropModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  public filesToUpload: File[] = [];
  public columnNames = ['name', 'file type', 'file size', 'last updated', 'delete'];
  @ViewChild(MatTable) table: MatTable<File>;

  constructor(private store: Store) {}

  public onFileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.filesToUpload.push(file);
          this.table.renderRows();
        });
      }
    }
  }

  public onFileSelected(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.files?.length) {
      return;
    }    
    this.filesToUpload.push(eventTarget.files[0]);  
    this.table.renderRows(); 
  }
  
  public removeFile(fileToRemove: File) {
    this.filesToUpload = this.filesToUpload.filter(file => file !== fileToRemove);
    this.table.renderRows();
  }
  
  uploadFiles() {
    this.store.dispatch(MyFilesActions.uploadFiles({ files: this.filesToUpload }))
  }
}
