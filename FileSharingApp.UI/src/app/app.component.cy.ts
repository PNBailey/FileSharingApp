import { AccountService } from "./account/account.service";
import { AppComponent } from "./app.component";
import { User } from "./models/user";
import { setupCypressConfig } from "./shared/testing/cypress-config-setup/cypress-config-setup";
import { getMockAccountService } from "./shared/testing/cypress-config-setup/mock-account-service-setup";
import { getValidationServiceMock } from "./shared/testing/cypress-config-setup/validation-service-setup";

describe('AppComponent', () => {

    const elementBindings = {
        sidenavMenu: '[data-cy=sidenav-menu]',
        firstMenuItem: '[data-cy=first-menu-item]',
        toolbar: '[data-cy=toolbar]'
    }

    const validationService = getValidationServiceMock();
    const accountService = getMockAccountService(validationService);

    it('should mount', () => {
        mountComponent();
    });
    
    beforeEach(() => {
        cy.stub(window.localStorage, 'getItem').returns(JSON.stringify(new User()));
        cy.stub(accountService, 'setLoggedOnUser');
        mountComponent();
    });

    it('should call local storage get item method', () => {
        expect(window.localStorage.getItem).to.be.called;
    });

    it('should call AccountService setLoggedOnUser method when initialised', () => {
        expect(accountService.setLoggedOnUser).to.be.called;
    });

    describe('sidenav', () => {
        it('should open when drawer is toggled', () => {
            cy.get('mat-sidenav-container').should('have.css', 'width', '500px')
            .then(($container) => {
                $container.css({
                  width: '600px',
                  height: '600px'
                });
              });
            cy.get(elementBindings.toolbar).trigger('showSideNav', {force:true});
            cy.get(elementBindings.firstMenuItem).should('be.visible');
        });
    });

    const mountComponent = () => {
        cy.mount(AppComponent, setupCypressConfig<AppComponent>({
            providers: [
                {provide: AccountService, useValue: accountService}
            ]
        }));
    };
});