import { AfterViewInit, Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { Folder } from '../models/folder';
import { TextLengthPipe } from '../shared/pipes/text-length-pipe';
import { User } from '../models/user';
import { TreeModule } from 'primeng/tree';
import { TreeDragDropService } from 'primeng/api';
import { ParentFolderFilterPipe } from '../shared/pipes/parent-folder-filter-pipe';
import { tokenHasExpired } from '../shared/helpers/jwt-helpers';
import { FolderNode } from '../models/folder-node';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getLoadingBool } from '../state/loading/loading.selector';
import { LoadingBoolName } from '../state/loading/loading.reducer';
import { Store } from '@ngrx/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FolderActions } from '../state/folder/folder.actions';
import { getAllFolders } from '../state/folder/folder.selector';

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
        MenuModule,
        ButtonModule,
        MatTooltipModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    providers: [TreeDragDropService]
})

export class SidenavComponent implements AfterViewInit {

    constructor(private store: Store) { }

    @Output() createNewFolderEvent = new EventEmitter();
    @Output() editFolderEvent = new EventEmitter<Folder>();
    @Output() changeFolderParentEvent = new EventEmitter<{ folderId: number, parentFolderId: number }>();
    @Output() folderSelectedEvent = new EventEmitter<Folder>();

    @Input() loggedOnUser$: Observable<User | null>;

    loadingFolders$ = this.store.select(getLoadingBool(LoadingBoolName.LOADING_FOLDERS));
    hasValidToken$: Observable<boolean>;
    destroyRef = inject(DestroyRef);
    nodes$: Observable<FolderNode[]>;

    ngAfterViewInit(): void {
        this.hasValidToken$ = this.loggedOnUser$.pipe(
            filter(user => !!user),
            map(user => !tokenHasExpired(user.token))
        );
        this.nodes$ = this.loggedOnUser$.pipe(
            filter(user => !!user),
            tap(() => this.store.dispatch(FolderActions.getAllFolders())),
            switchMap(() => this.store.select(getAllFolders)),
            map(folders => {
                return folders.map((folder: Folder) => new FolderNode(folder));
            })
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

    modifyFolder(folder: Folder, event: Event) {
        event.stopPropagation();
        this.editFolderEvent.emit(folder);
    }
}
