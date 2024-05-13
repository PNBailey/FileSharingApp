import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
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

// interface FlatNode {
//     expandable: boolean;
//     name: string;
//     level: number;
// }

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
        TreeModule
    ],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    providers: [TreeDragDropService]
})

export class SidenavComponent implements AfterViewInit {
    @Output() createNewFolderEvent = new EventEmitter();
    @Input() folders$: Observable<Folder[]>;
    @Input() loggedOnUser$: Observable<User | null>;
    folders!: FolderNode[];

    createNewFolder() {
        this.createNewFolderEvent.emit();
    }

    // private _transformer = (node: Folder, level: number) => {
    //     return {
    //         expandable: !!node.subFolders && node.subFolders.length > 0,
    //         name: node.name,
    //         level: level
    //     };
    // };

    // treeControl = new FlatTreeControl<FlatNode>(
    //     node => node.level,
    //     node => node.expandable,
    // );

    // treeFlattener = new MatTreeFlattener(
    //     this._transformer,
    //     node => node.level,
    //     node => node.expandable,
    //     node => node.subFolders
    // );

    // dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    ngAfterViewInit(): void {
        this.folders$.subscribe(folders => {
            this.folders = folders.filter(f => !f.parentFolderId).map(f => new FolderNode(f));
            console.log(this.folders);

        });
    }

    // hasChild = (_: number, node: FlatNode) => node.expandable;


}
