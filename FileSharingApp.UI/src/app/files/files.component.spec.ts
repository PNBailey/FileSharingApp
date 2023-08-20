import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesComponent } from './files.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideMockStore } from '@ngrx/store/testing';

describe('FilesComponent', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;
  let loader: HarnessLoader;
  const initialState = { files: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilesComponent
      ],
      providers: [
        provideMockStore({
          initialState
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
