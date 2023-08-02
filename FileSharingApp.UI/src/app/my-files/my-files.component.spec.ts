import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFilesComponent } from './my-files.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideMockStore } from '@ngrx/store/testing';

describe('MyFilesComponent', () => {
  let component: MyFilesComponent;
  let fixture: ComponentFixture<MyFilesComponent>;
  let loader: HarnessLoader;
  const initialState = { files: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyFilesComponent
      ],
      providers: [
        provideMockStore({
          initialState
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFilesComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
