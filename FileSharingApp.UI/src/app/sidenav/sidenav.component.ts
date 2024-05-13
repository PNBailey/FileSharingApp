import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Folder } from '../models/folder';
import { TextLengthPipe } from '../shared/pipes/text-length-pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../models/user';
import { TreeModule } from 'primeng/tree';
import { FolderNode } from '../models/folder-node';
import { TreeDragDropService } from 'primeng/api';
import { ParentFolderFilterPipe } from '../shared/pipes/parent-folder-filter-pipe';
import { ConvertToFolderNodesPipe } from '../shared/pipes/convert-to-folder-nodes-pipe';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        RouterOutlet,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        TextLengthPipe,
        MatTooltipModule,
        TreeModule,
        ParentFolderFilterPipe,
        ConvertToFolderNodesPipe
    ],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    providers: [TreeDragDropService]
})

export class SidenavComponent {

    @Output() createNewFolderEvent = new EventEmitter();
    @Output() changeFolderParentEvent = new EventEmitter<{ folderId: number, parentFolderId: number }>();
    @Input() folders$: Observable<Folder[]>;
    @Input() loggedOnUser$: Observable<User | null>;
    folders!: FolderNode[];

    createNewFolder() {
        this.createNewFolderEvent.emit();
    }

    onDrop(event: any) {
        let folderToUpdate = new Folder();
        folderToUpdate = {
            ...event.dragNode.data,
            parentFolderId: event.dropNode.data.id
        }
        this.changeFolderParentEvent.emit({ folderId: event.dragNode.data.id, parentFolderId: event.dropNode.data.id });
    }
}
