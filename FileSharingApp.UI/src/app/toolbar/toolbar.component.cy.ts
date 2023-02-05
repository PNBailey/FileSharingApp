import { of } from "rxjs";
import { AccountService } from "../account/account.service";
import { ToolbarComponent } from "./toolbar.component";
import { setupCypressConfig } from "../shared/testing/cypress-config-setup/cypress-config-setup";
import { getMockAccountService } from "../shared/testing/cypress-config-setup/mock-account-service-setup";
import { MatDialog } from "@angular/material/dialog";
import { getValidationServiceMock } from "../shared/testing/cypress-config-setup/validation-service-setup";

describe('ToolBarComponent', () => {

    const validationService = getValidationServiceMock();
    const accountService = getMockAccountService(validationService);

    const matDialog = {
        open: () => null
    };

    const elementBindings = {
        logoutButton: '[data-cy="logout-button"]',
        userMenuButton: '[data-cy="open-user-menu-button"]',
        menuButton: '[data-cy="menu-button"]',
        loginButton: '[data-cy="login-button"]',
        userMenu: '[data-cy="user-menu"]',
        userMenuButtons: '[data-cy="user-menu-button"]'
    }

    it('mounts', () => {
        cy.mount(ToolbarComponent, setupCypressConfig<ToolbarComponent>({
            providers: [
                {provide: AccountService, useValue: accountService}
            ]
        }));
    });

    beforeEach(() => {    
        cy.mount(ToolbarComponent, setupCypressConfig<ToolbarComponent>({
            providers: [
                {provide: AccountService, useValue: accountService}
            ]
        }));
    });

    describe('logout button', () => {
        it('should call the account service logout method', () => {
            cy.spy(accountService, 'logout').as('accountService-logout-method');
            cy.get(elementBindings.userMenuButton).click();
            cy.wait(1000);
            cy.get(elementBindings.userMenuButtons).should('be.visible');
            cy.get(elementBindings.userMenuButtons).eq(1).click();
            cy.get('@accountService-logout-method').should('have.been.called');
        });
    });

    describe('menu button', () => {
        it('should emit the showSideNav event emitter', () => {
            cy.get(elementBindings.menuButton).click();
            cy.wait(1000);
            cy.get('@showSideNavSpy').should('have.been.calledOnce');
        });
    });

    describe('login button', () => {
        it('should not be visible when user is logged in', () => {
            cy.get(elementBindings.loginButton).should('have.length', 0);
        });
        it('should be visible when user is not logged in', () => {
            // cy.mount(ToolbarComponent, setupCypressConfig<ToolbarComponent>({
            //     providers: [{
            //         provide: AccountService, 
            //         useValue: {loggedOnUser$: of(null)}
            //     }]
            // }));
            cy.get(elementBindings.userMenuButton).click();
            cy.get(elementBindings.userMenuButtons).eq(1).click();
            cy.get(elementBindings.userMenuButton).click();
            cy.get(elementBindings.loginButton).should('be.visible');
        });
        it('should call the MatDialog open method', () => {
            cy.mount(ToolbarComponent, setupCypressConfig<ToolbarComponent>({
                providers: [
                    {provide: AccountService, useValue: {loggedOnUser$: of(null)}},
                    {provide: MatDialog, useValue: matDialog}
                ]
            }));
            cy.spy(matDialog, 'open').as('matDialog-open-method');
            cy.get(elementBindings.loginButton).click();
            cy.wait(1000);
            cy.get('@matDialog-open-method').should('have.been.called');
        });
    });
    describe('user menu button', () => {
        it('should be visible when user is logged in', () => {
            cy.get(elementBindings.userMenuButton).should('be.visible');
        });
        it('should not be visible when user is not logged in', () => {
            cy.mount(ToolbarComponent, setupCypressConfig<ToolbarComponent>({
                providers: [{
                    provide: AccountService, 
                    useValue: {loggedOnUser$: of(null)}
                }]
            }));
            cy.wait(1000);
            cy.get(elementBindings.userMenuButton).should('have.length', 0);
        });
    });
    describe('user menu', () => {
        it('should contain two buttons', () => {
            cy.get(elementBindings.userMenuButton).click();
            cy.wait(1000);
            cy.get(elementBindings.userMenuButtons).should('have.length', 2);
        });
    });
});