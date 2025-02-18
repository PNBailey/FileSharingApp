import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable, filter, map } from 'rxjs';
import { Folder } from '../models/folder';
import { TextLengthPipe } from '../shared/pipes/text-length-pipe';
import { User } from '../models/user';
import { TreeModule } from 'primeng/tree';
import { TreeDragDropService } from 'primeng/api';
import { ParentFolderFilterPipe } from '../shared/pipes/parent-folder-filter-pipe';
import { ConvertToFolderNodesPipe } from '../shared/pipes/convert-to-folder-nodes-pipe';
import { tokenHasExpired } from '../shared/helpers/jwt-helpers';

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
        TreeModule,
        ParentFolderFilterPipe,
        ConvertToFolderNodesPipe
    ],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    providers: [TreeDragDropService]
})

export class SidenavComponent implements AfterViewInit {

    @Output() createNewFolderEvent = new EventEmitter();
    @Output() changeFolderParentEvent = new EventEmitter<{ folderId: number, parentFolderId: number }>();
    @Output() folderSelectedEvent = new EventEmitter<Folder>();
    @Input() folders$: Observable<Folder[]>;
    @Input() loggedOnUser$: Observable<User | null>;
    hasValidToken$: Observable<boolean>;

    ngAfterViewInit(): void {
        this.hasValidToken$ = this.loggedOnUser$.pipe(
            filter(user => !!user),
            map(user => !tokenHasExpired(user.token))
        );
    }

    createNewFolder() {
        this.createNewFolderEvent.emit();
    }

    onDrop(event: any) {
        this.changeFolderParentEvent.emit({ folderId: event.dragNode.data.id, parentFolderId: event.dropNode.data.id });
    }

    folderSelected(event: any) {
        this.folderSelectedEvent.emit(event.node.data)
    }
}
