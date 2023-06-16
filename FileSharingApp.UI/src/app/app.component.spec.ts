import { AppComponent } from "./app.component";
import { User } from "./models/user";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AccountDialogComponent } from "./account/account-dialog.component";


describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let store: MockStore;
    let initialState: { account: { loggedOnUser: User | null } };
    const testUser = new User();
    testUser.username = "Mr Test";
    testUser.email = "Test@gmail.com";

    const matDialogMock = {
        open: () => null
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                AppComponent,
                ToolbarComponent,
                MatSidenavModule,
                MatDialogModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                AccountDialogComponent
            ],
            providers: [
                provideMockStore({ initialState }),
                { provide: MatDialog, useValue: matDialogMock }
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.inject(MockStore);
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should call local storage get item method', () => {
        spyOn(localStorage, 'getItem');
        component.setCurrentUser();
        expect(localStorage.getItem).toHaveBeenCalled();
    });

    it('should dispatch setLoggedOnUser action when user found in local storage', () => {
        spyOn(store, 'dispatch');
        localStorage.setItem('user', JSON.stringify(testUser));
        component.setCurrentUser();
        expect(store.dispatch).toHaveBeenCalled();
    });
});
