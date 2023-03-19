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
        editProfileCardComponent: '[data-cy="edit-profile-card-component"]',
        container: '[data-cy="container"]',
        uploadingProfilePictureSpinner: '[data-cy="uploading-profile-picture-spinner"]'
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
        cy.get(elementBindings.editProfileCardComponent).then((editProfileCardComponent) => {
            editProfileCardComponent.css({
                width: '600px',
                height: '600px'
            });
        });
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
        cy.get(elementBindings.editProfileCardComponent).then((editProfileCardComponent) => {
            editProfileCardComponent.css({
                width: '600px',
                height: '600px'
            });
        });
        cy.get(elementBindings.editProfileCardComponent).trigger('newImageSelected');
        cy.get('@userService-uploadProfilePicture-method').should('have.been.called');
    });

    it('uploading profile picture loading spinner should be displayed when image is uploading', () => {
        cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
            componentProperties: {
                uploadingProfilePicture$: of(true)
            }
        }));
        cy.get(elementBindings.uploadingProfilePictureSpinner).should('be.visible');
    });

    it('uploading profile picture loading spinner should not be displayed when image is not uploading', () => {
        cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
            componentProperties: {
                uploadingProfilePicture$: of(false)
            }
        }));
        cy.get(elementBindings.uploadingProfilePictureSpinner).should('have.length', 0);
    });
});