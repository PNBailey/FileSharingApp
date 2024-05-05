import { of } from "rxjs";
import { ToolbarComponent } from "./toolbar.component";
import { User } from "../models/user";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import {HarnessLoader} from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import {MatMenuHarness} from '@angular/material/menu/testing';
import { MatMenuModule } from "@angular/material/menu";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { ChangeDetectionStrategy } from "@angular/core";



describe('ToolBarComponent', () => {
    let fixture: ComponentFixture<ToolbarComponent>;
    let component: ToolbarComponent;
    let loader: HarnessLoader;
    const testUser = new User();
    testUser.username = "Mr test";
    testUser.email = "Test@gmail.com";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ToolbarComponent,
                RouterTestingModule,
                MatMenuModule,
                MatButtonModule,
                BrowserAnimationsModule
            ]
        })
            .overrideComponent(ToolbarComponent, {
                set: {changeDetection: ChangeDetectionStrategy.Default}
            });
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    describe('mounts', () => {
        it('should mount the component', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('logout button', () => {
        it('should emit the logoutUser event when clicked', async () => {
            spyOn(component.logoutUser, 'emit');
            component.loggedOnUser$ = of(new User());
            const userMenu = await loader.getHarness(MatMenuHarness);
            await userMenu.open();
            const items = await userMenu.getItems();
            await items[items.length - 1].click();
            expect(component.logoutUser.emit).toHaveBeenCalled();
        });
    });

    describe('edit profile button', () => {
        it('should call the router link navigate method with correct url path', async () => {
            spyOn(component.routeToEditProfile, 'emit');
            component.loggedOnUser$ = of(new User());
            const userMenu = await loader.getHarness(MatMenuHarness);
            await userMenu.open();
            const items = await userMenu.getItems();
            await items[0].click();
            expect(component.routeToEditProfile.emit).toHaveBeenCalled();
        });
    });
  
    describe('login button', () => {
        it('should emit the openAccountDialog event emitter', async () => {
            spyOn(component.openAccountDialog, 'emit');
            const loginButton = await loader.getHarness(MatButtonHarness.with({ selector: '.login-button' }));
            await loginButton.click();
            expect(component.openAccountDialog.emit).toHaveBeenCalled();
        });
        it('should not be visible when user is logged in', async () => {
            component.loggedOnUser$ = of(new User());
            fixture.detectChanges();
            expect(await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '.login-button' }))).toBeNull();
        });
        it('should be visible when user is not logged in', async () => {
            component.loggedOnUser$ = of(null);
            expect(await loader.getHarness(MatButtonHarness.with({ selector: '.login-button' }))).toBeTruthy();
        });
    });


    describe('user menu button', () => {
        it('should be visible when user is logged in', async () => {
            component.loggedOnUser$ = of(new User());
            expect(await loader.getHarness(MatButtonHarness.with({ selector: '.user-menu-button' }))).toBeTruthy();
        });
        it('should not be visible when user is not logged in', async () => {
            component.loggedOnUser$ = of(null);
            expect(await loader.getHarnessOrNull(MatButtonHarness.with({ selector: '.user-menu-button' }))).toBeNull();
        });
        it('should show the user menu when clicked', async () => {
            component.loggedOnUser$ = of(new User());
            const userMenuButton = await loader.getHarness(MatButtonHarness.with({ selector: '.user-menu-button' }));
            await userMenuButton.click();
            expect(await loader.getHarness(MatMenuHarness)).toBeTruthy();
        });
    });
    describe('user menu', () => {
        it('should not be visible when component is initialized', async () => {
            component.loggedOnUser$ = of(null);
            expect(await loader.getHarnessOrNull(MatMenuHarness)).toBeNull();
        });
    });
});


