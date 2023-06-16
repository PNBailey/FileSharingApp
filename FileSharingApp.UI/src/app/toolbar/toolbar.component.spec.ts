// import { of } from "rxjs";
// import { AccountService } from "../services/account.service";
// import { ToolbarComponent } from "./toolbar.component";
// import { setupCypressConfig } from "../shared/testing/cypress-config-setup/cypress-config-setup";
// import { getMockAccountService } from "../shared/testing/cypress-config-setup/mock-account-service-setup";
// import { MatDialog } from "@angular/material/dialog";
// import { getValidationServiceMock } from "../shared/testing/cypress-config-setup/validation-service-setup";
// import { MountConfig } from "cypress/angular";
// import { User } from "../models/user";

// describe('ToolBarComponent', () => {

//     const validationService = getValidationServiceMock();
//     const accountService = getMockAccountService(validationService);

//     const elementBindings = {
//         logoutButton: '[data-cy="logout-button"]',
//         userMenuButton: '[data-cy="open-user-menu-button"]',
//         menuButton: '[data-cy="menu-button"]',
//         loginButton: '[data-cy="login-button"]',
//         userMenu: '[data-cy="user-menu"]',
//         userMenuButtons: '[data-cy="user-menu-button"]'
//     }

//     it('mounts', () => {
//         mountComponent();
//     });

//     beforeEach(() => {
//         mountComponent();
//     });

//     describe('logout button', () => {
//         it('should emit the logoutUser event', () => {
//             cy.get(elementBindings.userMenuButton).click();
//             cy.get(elementBindings.userMenuButtons).should('be.visible');
//             cy.get(elementBindings.userMenuButtons).eq(1).click();
//             cy.get('@logoutUserSpy').should('have.been.called');
//         });
//     });

//     describe('menu button', () => {
//         it('should emit the showSideNav event emitter', () => {
//             cy.get(elementBindings.menuButton).click();
//             cy.get('@showSideNavSpy').should('have.been.calledOnce');
//         });
//     });

//     describe('login button', () => {
//         it('should not be visible when user is logged in', () => {
//             cy.get(elementBindings.loginButton).should('have.length', 0);
//         });
//         it('should be visible when user is not logged in', () => {
//             setLoggedOnUserValueToNull();
//             cy.get(elementBindings.loginButton).should('be.visible');
//         });
//         it('should emit the openAccountDialog event', () => {
//             setLoggedOnUserValueToNull();
//             cy.get(elementBindings.loginButton).click();
//             cy.get('@openAccountDialogSpy').should('have.been.called');
//         });
//     });
//     describe('user menu button', () => {
//         it('should be visible when user is logged in', () => {
//             cy.get(elementBindings.userMenuButton).should('be.visible');
//         });
//         it('should not be visible when user is not logged in', () => {
//             setLoggedOnUserValueToNull();
//             cy.get(elementBindings.userMenuButton).should('have.length', 0);
//         });
//         it('should emit the showSideNav event', () => {
//             cy.get(elementBindings.menuButton).click();
//             cy.get('@showSideNavSpy').should('have.been.called');
//         });
//     });
//     describe('user menu', () => {
//         it('should contain two buttons', () => {
//             cy.get(elementBindings.userMenuButton).click();
//             cy.get(elementBindings.userMenuButtons).should('have.length', 2);
//         });
//     });

//     const mountComponent = (configOverride: MountConfig<ToolbarComponent> = {}) => {
//         cy.mount(ToolbarComponent, setupCypressConfig<ToolbarComponent>({
//             componentProperties: {
//                 loggedOnUser$: of(new User())
//             },
//             providers: [
//                 {provide: AccountService, useValue: accountService},
//             ],
//             ...configOverride
//         }));
//     }

//     const setLoggedOnUserValueToNull = () => {
//         mountComponent({
//             componentProperties: {
//                 loggedOnUser$: of(null)
//             }
//         });
//     }
// });

import { of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ToolbarComponent } from "./toolbar.component";
import { AccountService } from "../services/account.service";
import { User } from "../models/user";
import { ComponentFixture, TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";
import {HarnessLoader} from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {MatButtonHarness} from '@angular/material/button/testing';


describe('ToolBarComponent', () => {
  let fixture: ComponentFixture<ToolbarComponent>;
  let component: ToolbarComponent;
  let accountService: AccountService;
  let dialog: MatDialog;
  let loader: HarnessLoader;
  const testUser = new User();
  testUser.username = "Mr test";
  testUser.email = "Test@gmail.com";

  beforeEach(() => {
    accountService = jasmine.createSpyObj('AccountService', ['logoutUser']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      imports: [
        ToolbarComponent,
        RouterTestingModule,
      ]
    })
    fixture = TestBed.createComponent(ToolbarComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('mounts', () => {
    it('should mount the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('logout button', () => {
    it('should emit the logoutUser event', () => {
      spyOn(component.logoutUser, 'emit');
      component.logout();
      expect(component.logoutUser.emit).toHaveBeenCalled();
    });
  });

  describe('menu button', () => {
    it('should emit the showSideNav event emitter', () => {
      spyOn(component.showSideNav, 'emit');
      component.openSideNav();
      expect(component.showSideNav.emit).toHaveBeenCalled();
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
    } );
  });

    

  //   it('should be visible when user is not logged in', () => {
  //     component.loggedOnUser$ = of(null);
  //     expect(component.loginButtonVisible).toBe(true);
  //   });

  //   it('should emit the openAccountDialog event', () => {
  //     component.loggedOnUser$ = of(null);
  //     component.openAccountDialog();
  //     expect(dialog.open).toHaveBeenCalled();
  //   });
  // });

  // describe('user menu button', () => {
  //   it('should be visible when user is logged in', () => {
  //     component.loggedOnUser$ = of(new User());
  //     expect(component.userMenuButtonVisible).toBe(true);
  //   });

  //   it('should not be visible when user is not logged in', () => {
  //     component.loggedOnUser$ = of(null);
  //     expect(component.userMenuButtonVisible).toBe(false);
  //   });

  //   it('should emit the showSideNav event', () => {
  //     component.showSideNav();
  //     expect(component.showSideNavSpy).toHaveBeenCalled();
  //   });
  // });

  // describe('user menu', () => {
  //   it('should contain two buttons', () => {
  //     component.userMenuOpen = true;
  //     expect(component.userMenuButtons.length).toBe(2);
  //   });
  // });
});


