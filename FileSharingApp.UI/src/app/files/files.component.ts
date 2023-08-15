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

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FileComponent
  ],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent {

  files$: Observable<AppFile[]> = this.store.select(getAllFiles);

  constructor(private store: Store) {
    this.store.dispatch(MyFilesActions.getAllFiles());
  }

  onFileSelected(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.files?.length) {
      return;
    }    
    this.store.dispatch(MyFilesActions.uploadFile({ file: eventTarget.files[0] }))
  }

}
