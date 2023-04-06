import { of } from "rxjs";
import { User } from "src/app/models/user";
import { setupCypressConfig } from "src/app/shared/testing/cypress-config-setup/cypress-config-setup";
import { EditProfileCardComponent } from "./edit-profile-card.component";

describe("EditProfileComponent", () => {
  const elementBindings = {
    bio: '[data-cy="bio"]',
    profilePicture: '[data-cy="profile-picture"]',
    fileInput: '[data-cy="file-input"]'
  }

  it("Mounts", () => {
    cy.mount(EditProfileCardComponent, setupCypressConfig<EditProfileCardComponent>());
  });

  const mockUser = new User();
  mockUser.id = 0;
  mockUser.bio = "test";
  mockUser.profilePictureUrl = "";
  mockUser.token = "testToken";
  mockUser.username = "testUser";

  beforeEach(() => {
    cy.mount(EditProfileCardComponent, setupCypressConfig<EditProfileCardComponent>({
      componentProperties: {
        loggedOnUser$: of(mockUser)
      }
    }));
  });

  it("bio should contain bio for user", () => {
    cy.get(elementBindings.bio).should('have.text', 'test');
  });

  it("profile picture should be default placeholder image when user profile picture is null", () => {
    cy.get(elementBindings.profilePicture).should('have.attr', 'src').should('include', 'https://res.cloudinary.com/filesharingapp/image/upload/v1676504732/Placeholder_user_image_t5klyw.jpg')
  });

  it("profile picture should be users profile picture", () => {
    mockUser.profilePictureUrl = 'https://res.cloudinary.com/filesharingapp/image/upload/v1677632350/Application%20Assets/IMG_20200619_164656_k76jjw.jpg';
    cy.mount(EditProfileCardComponent, setupCypressConfig<EditProfileCardComponent>({
      componentProperties: {
        loggedOnUser$: of(mockUser)
      }
    }));
    cy.wait(1000);
    cy.get(elementBindings.profilePicture).should('have.attr', 'src').should('include', 'https://res.cloudinary.com/filesharingapp/image/upload/v1677632350/Application%20Assets/IMG_20200619_164656_k76jjw.jpg');
  });

  it("onFileSelected method should call incorrectFileTypeSelected event emitter", () => {
    cy.get(elementBindings.fileInput).selectFile('cypress/fixtures/incorrect file type.webp', { force: true });
    cy.wait(1000);
    cy.get('@incorrectFileTypeSelectedSpy').should('have.been.called');
  });

  it("onFileSelected method should call newImageSelected event emitter", () => {
    cy.get(elementBindings.fileInput).selectFile('cypress/fixtures/Placeholder user image.jpg', { force: true });
    cy.wait(1000);
    cy.get('@newImageSelectedSpy').should('have.been.called');
  });
});