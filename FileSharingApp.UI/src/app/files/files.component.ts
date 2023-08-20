import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { MyFilesActions } from '../state/file/file.actions';
import { getAllFiles } from '../state/file/file.selector';
import { Observable } from 'rxjs';
import { AppFile } from '../models/app-file';
import { FileComponent } from './file/file.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FileComponent,
    MatDialogModule
  ],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent {

  files$: Observable<AppFile[]> = this.store.select(getAllFiles);

  constructor(
    private store: Store,
    public dialog: MatDialog
  ) {
    this.store.dispatch(MyFilesActions.getAllFiles());
  }

  openDialog() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      minWidth: '80vw',
    });
  }
}
