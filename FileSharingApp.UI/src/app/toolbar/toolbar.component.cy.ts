import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { AccountService } from "../account/account.service";
import { TestUser } from "../models/test-models/testUser";
import { ToolbarComponent } from "./toolbar.component";

describe('ToolBarComponent', () => {

    const user = new TestUser();

    const accountService = {
        loggedOnUser$: of(user),
        logout: () => {
            return null;
        }
    }

    const elementBindings = {
        logoutButton: '[data-cy="logout-button"]',
        userMenuButton: '[data-cy="open-user-menu-button"]',
    }

    it('mounts', () => {
        cy.mount(ToolbarComponent, {
            imports: [
                MatDialogModule,
                MatMenuModule,
                MatToolbarModule,
                MatButtonModule,
                BrowserAnimationsModule,
                MatIconModule
            ],
            declarations: [ToolbarComponent],
            providers: [{provide: AccountService, useValue: accountService}]
        });
    });
    beforeEach(() => {
        cy.mount(ToolbarComponent, {
            imports: [
                MatDialogModule,
                MatMenuModule,
                MatToolbarModule,
                MatButtonModule,
                BrowserAnimationsModule,
                MatIconModule
            ],
            declarations: [ToolbarComponent],
            providers: [{provide: AccountService, useValue: accountService}]
        });
    });
    describe('logout method', () => {
        it('should call the account service logout method', () => {
            cy.spy(accountService, 'logout').as('accountService-logout-method');
            cy.get(elementBindings.userMenuButton).click();
            cy.wait(1000);
            cy.get(elementBindings.logoutButton).should('be.visible');
            cy.get(elementBindings.logoutButton).click();
            cy.get('@accountService-logout-method').should('have.been.called');
        });
    });
});