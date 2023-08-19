import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatTable, MatTableModule} from '@angular/material/table';
import { Store } from '@ngrx/store';
import { MyFilesActions } from 'src/app/state/file/file.actions';
import { AppFile } from 'src/app/models/app-file';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

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
    MatIconModule,
    FormsModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  public filesToUpload: AppFile[] = [];
  public columnNames = ['name', 'description', 'file type', 'last updated', 'delete'];
  @ViewChild(MatTable) table: MatTable<AppFile>;

  constructor(private store: Store) {}

  public onFileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.filesToUpload.push(this.mapToAppFile(file));
          this.table.renderRows();
        });
      }
    }
  }

  private mapToAppFile(file: File): AppFile {
    const newAppFile = new AppFile();
    newAppFile.name = file.name;
    newAppFile.lastUpdated = new Date(file.lastModified);
    newAppFile.fileTypeName = file.type;
    newAppFile.description = "";    
    return newAppFile;
  }

  public onFileSelected(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.files?.length) {
      return;
    }    
    // this.store.dispatch(MyFilesActions.uploadFile({ file: eventTarget.files[0] }))
    this.filesToUpload.push(this.mapToAppFile(eventTarget.files[0]));    
    this.table.renderRows();    
  }

  public removeFile(fileToRemove: AppFile) {
    this.filesToUpload = this.filesToUpload.filter(file => file !== fileToRemove);
    this.table.renderRows();
  }

  test() {
    console.log(this.filesToUpload);
    
  }
}
