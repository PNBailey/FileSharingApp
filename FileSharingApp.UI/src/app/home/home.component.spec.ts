import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HomeComponent
      ]
    })
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('mounts', () => {
    it('should mount the component', () => {
      expect(component).toBeTruthy();
    });
  });

});