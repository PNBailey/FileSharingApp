import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileState } from '../state/file/file.reducer';
import { Store } from '@ngrx/store';
import { MyFilesActions } from '../state/file/file.actions';

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './my-files.component.html',
  styleUrls: ['./my-files.component.scss']
})
export class MyFilesComponent {

  constructor(private store: Store<{ files: FileState }>) {}

  onFileSelected(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.files?.length) {
      return;
    }    
    this.store.dispatch(MyFilesActions.uploadFile({ file: eventTarget.files[0] }))
  }

}
