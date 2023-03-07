import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { SnackbarAction, SnackbarClassType, SnackbarDuration, SnackBarItem } from "../models/snackbar-item";
import { MessageHandlingService } from "../services/message-handling.service";
import { UserService } from "../services/user.service";
import { setupCypressConfig } from "../shared/testing/cypress-config-setup/cypress-config-setup";
import { EditProfileComponent } from "./edit-profile.component";

describe('EditProfileComponent', () => {
    it('mounts', () => {
        cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>())
    });

    const elementBindings = {
        editProfileCardComponent: '[data-cy="edit-profile-card-component"]'
    }

    const messageHandlingService = {
        onDisplayNewMessage: (snackBarItem: SnackBarItem) => {
            return null;
        }
    }

    const userService = {
        uploadProfilePicture: (file: File) => {
            return of(null);
        }
    }

    beforeEach(() => {
        cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
            providers: [
                {provide: MessageHandlingService, useValue: messageHandlingService},
                {provide: UserService, useValue: userService}
            ]
        }));
    });

    it('displayIncorrectFileTypeMessage method should call onDisplayMessage method from the messageHandlingService', () => {
        cy.spy(messageHandlingService, 'onDisplayNewMessage').as('messageHandlingService-onDisplayNewMessage-method');
        cy.get(elementBindings.editProfileCardComponent).trigger('incorrectFileTypeSelected');
        cy.get('@messageHandlingService-onDisplayNewMessage-method').should('have.been.calledOnceWithExactly', {
            message: "File selected must be JPEG or PNG file",
            action: SnackbarAction.Close,
            classType: SnackbarClassType.Error,
            duration: SnackbarDuration.Medium
        });
    });

    it('uploadProfilePicture method should call user service uploadProfilePicture method', () => {
        cy.spy(userService, 'uploadProfilePicture').as('userService-uploadProfilePicture-method');
        cy.get(elementBindings.editProfileCardComponent).trigger('newImageSelected', {key: 'value'});
        cy.get('@userService-uploadProfilePicture-method').should('have.been.called');
    });
});