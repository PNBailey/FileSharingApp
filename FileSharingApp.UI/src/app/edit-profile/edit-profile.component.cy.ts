import { of, tap } from "rxjs";
import { IdentityResult } from "../models/identityResult";
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
        updatingProfileSpinner: '[data-cy="updating-profile-spinner"]',
        editProfileInfoComponent: '[data-cy="edit-profile-info-component"]'
    }

    const messageHandlingService = {
        onDisplayNewMessage: (snackBarItem: SnackBarItem) => {
            return snackBarItem;
        }
    }

    const userService = {
        uploadProfilePicture: (file: File) => {
            return of(file);
        },
        updateUserInfo: () => {
            const identityResult = new IdentityResult();
            identityResult.succeeded = true;
            return of(identityResult).pipe(
                tap((res: IdentityResult) => {
                  if(res.succeeded) {
                    accountService.setLoggedOnUser();
                    messageHandlingService.onDisplayNewMessage({
                        message: "Successfully Updated",
                        action: SnackbarAction.Close,
                        classType: SnackbarClassType.Success,
                        duration: SnackbarDuration.Medium
                      });
                  }
                })
            )
        }
    }

    const accountService = {
        setLoggedOnUser: () => {
            return null;
        }
    };

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

    it('updating profile loading spinner should be displayed when image is uploading', () => {
        cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
            componentProperties: {
                updatingProfile$: of(true)
            }
        }));
        cy.get(elementBindings.updatingProfileSpinner).should('be.visible');
    });

    it('updating profile loading spinner should not be displayed when profile is not updating', () => {
        cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
            componentProperties: {
                updatingProfile$: of(false)
            }
        }));
        cy.get(elementBindings.updatingProfileSpinner).should('have.length', 0);
    });

    it('UserService updateUserInfo method is called when infoUpdated event is triggered', () => {
        cy.spy(userService, 'updateUserInfo').as('userService-updateUserInfo-method');
        cy.get(elementBindings.editProfileInfoComponent).then((editProfileInfoComponent) => {
            editProfileInfoComponent.css({
                width: '600px',
                height: '600px'
            });
        });
        cy.get(elementBindings.editProfileInfoComponent).trigger('infoUpdated', {force: true});
        cy.get('@userService-updateUserInfo-method').should('have.been.called');
    });

    it('AccountService updateUserInfo method is called when infoUpdated event is triggered', () => {
        cy.spy(accountService, 'setLoggedOnUser').as('accountService-setLoggedOnUser-method');
        cy.get(elementBindings.editProfileInfoComponent).then((editProfileInfoComponent) => {
            editProfileInfoComponent.css({
                width: '600px',
                height: '600px'
            });
        });
        cy.get(elementBindings.editProfileInfoComponent).trigger('infoUpdated', {force: true});
        cy.get('@accountService-setLoggedOnUser-method').should('have.been.called');
    });

    it('messageHandlingService onDisplayNewMessage method is called when infoUpdated event is triggered', () => {
        cy.spy(messageHandlingService, 'onDisplayNewMessage').as('messageHandlingService-onDisplayNewMessage-method');
        cy.get(elementBindings.editProfileInfoComponent).then((editProfileInfoComponent) => {
            editProfileInfoComponent.css({
                width: '600px',
                height: '600px'
            });
        });
        cy.get(elementBindings.editProfileInfoComponent).trigger('infoUpdated', {force: true});
        cy.get('@messageHandlingService-onDisplayNewMessage-method').should('have.been.called');
    });
});