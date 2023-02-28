import { setupCypressConfig } from "../shared/testing/cypress-config-setup/cypress-config-setup";
import { EditProfileComponent } from "./edit-profile.component";

describe("EditProfileComponent", () => {
  const elementBindings = {
    bio: '[data-cy="bio"]',
    profilePicture: '[data-cy="profile-picture"]',
  }

  it("Mounts", () => {
    cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
      componentProperties: {
        bio: "test",
        profilePictureUrl: undefined
      }
    }));
  });

  beforeEach(() => {
    cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
      componentProperties: {
        bio: "test"
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
    cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
      componentProperties: {
        profilePictureUrl: 'test/url'
      }
    }));
    cy.get(elementBindings.profilePicture).should('have.attr', 'src').should('include', 'test/url')
  });
});