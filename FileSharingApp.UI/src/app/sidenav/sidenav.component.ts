import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Folder } from '../models/folder';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        RouterOutlet,
        MatButtonModule,
        MatCardModule,
        MatIconModule
    ],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
    @Output() createNewFolderEvent = new EventEmitter();
    @Input() folders$: Observable<Folder[]>;

    createNewFolder() {
        this.createNewFolderEvent.emit();
    }
}
