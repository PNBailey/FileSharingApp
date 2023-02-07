import { createOutputSpy } from "cypress/angular";
import { AccountService } from "./account/account.service";
import { AppComponent } from "./app.component";
import { setupCypressConfig } from "./shared/testing/cypress-config-setup/cypress-config-setup";
import { getMockAccountService } from "./shared/testing/cypress-config-setup/mock-account-service-setup";
import { getValidationServiceMock } from "./shared/testing/cypress-config-setup/validation-service-setup";
import { TestUser } from "./shared/testing/models/testUser";
import { ToolbarComponent } from "./toolbar/toolbar.component";

describe('AppComponent', () => {

    const elementBindings = {
        sidenavMenu: '[data-cy=sidenav-menu]',
        firstMenuItem: '[data-cy=first-menu-item]',
        toolbar: '[data-cy=toolbar]'
    }

    const matSidenav = {
        toggle: () => null
    }

    const validationService = getValidationServiceMock();
    const accountService = getMockAccountService(validationService);

    it('should mount', () => {
        mountComponent();
    });
    
    beforeEach(() => {
        cy.stub(window.localStorage, 'getItem').returns(JSON.stringify(new TestUser()));
        cy.stub(accountService, 'setLoggedOnUser');
        mountComponent();
    });

    it('should call local storage get item method', () => {
        expect(window.localStorage.getItem).to.be.called;
    });

    it('should call AccountService setLoggedOnUser method when initialised', () => {
        expect(accountService.setLoggedOnUser).to.be.called;
    });

    const mountComponent = () => {
        cy.mount(AppComponent, setupCypressConfig<AppComponent>({
            providers: [
                {provide: AccountService, useValue: accountService}
            ]
        }));
    };
});