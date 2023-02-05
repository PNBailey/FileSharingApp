import { AccountService } from "./account/account.service";
import { AppComponent } from "./app.component";
import { setupCypressConfig } from "./shared/testing/cypress-config-setup/cypress-config-setup";
import { getMockAccountService } from "./shared/testing/cypress-config-setup/mock-account-service-setup";
import { getValidationServiceMock } from "./shared/testing/cypress-config-setup/validation-service-setup";

describe('AppComponent', () => {

    const elementBindings = {
        sidenavMenu: '[data-cy=sidenav-menu]'
    }

    it('should mount', () => {
        cy.mount(AppComponent, setupCypressConfig<AppComponent>({
            providers: [
                {provide: AccountService, useValue: accountService}
            ]
        }));
    });
    
    const validationService = getValidationServiceMock();
    const accountService = getMockAccountService(validationService);

    beforeEach(() => {
        cy.mount(AppComponent, setupCypressConfig<AppComponent>({
            providers: [
                {provide: AccountService, useValue: accountService}
            ]
        }));
    });
});