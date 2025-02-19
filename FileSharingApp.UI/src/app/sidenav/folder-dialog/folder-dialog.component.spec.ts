import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFolderDialogComponent } from './new-folder-dialog.component';

describe('NewFolderDialogComponent', () => {
    let component: NewFolderDialogComponent;
    let fixture: ComponentFixture<NewFolderDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NewFolderDialogComponent]
        });
        fixture = TestBed.createComponent(NewFolderDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
