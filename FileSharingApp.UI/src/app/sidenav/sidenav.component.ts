import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Folder } from '../models/folder';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { ParentFolderFilterPipe } from '../shared/pipes/parent-folder-filter.pipe';
import { TextLengthPipe } from '../shared/pipes/text-length-pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../models/user';

interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

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
        MatTreeModule,
        ParentFolderFilterPipe,
        TextLengthPipe,
        MatTooltipModule
    ],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent {
    @Output() createNewFolderEvent = new EventEmitter();
    @Input() folders$: Observable<Folder[]>;
    @Input() loggedOnUser$: Observable<User | null>;

    createNewFolder() {
        this.createNewFolderEvent.emit();
    }

    private _transformer = (node: Folder, level: number) => {
        return {
            expandable: !!node.subFolders && node.subFolders.length > 0,
            name: node.name,
            level: level
        };
    };

    treeControl = new FlatTreeControl<FlatNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.subFolders
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    ngAfterViewInit(): void {
        this.folders$.subscribe(folders => {
            this.dataSource.data = folders.filter(f => !f.parentFolderId);
        });
    }

    hasChild = (_: number, node: FlatNode) => node.expandable;
}
