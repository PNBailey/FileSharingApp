import { setupCypressConfig } from "src/app/shared/testing/cypress-config-setup/cypress-config-setup";
import { EditProfileComponent } from "../edit-profile.component";
import { EditProfileCardComponent } from "./edit-profile-card.component";

describe("EditProfileComponent", () => {
  const elementBindings = {
    bio: '[data-cy="bio"]',
    profilePicture: '[data-cy="profile-picture"]',
  }

  it("Mounts", () => {
    cy.mount(EditProfileCardComponent, setupCypressConfig<EditProfileCardComponent>({
      componentProperties: {
        bio: "test",
        profilePictureUrl: undefined
      }
    }));
  });

  beforeEach(() => {
    cy.mount(EditProfileCardComponent, setupCypressConfig<EditProfileCardComponent>({
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
    cy.mount(EditProfileCardComponent, setupCypressConfig<EditProfileCardComponent>({
      componentProperties: {
        profilePictureUrl: 'https://res.cloudinary.com/filesharingapp/image/upload/v1677632350/Application%20Assets/IMG_20200619_164656_k76jjw.jpg'
      }
    }));
    cy.wait(1000);
    cy.get(elementBindings.profilePicture).should('have.attr', 'src').should('include', 'https://res.cloudinary.com/filesharingapp/image/upload/v1677632350/Application%20Assets/IMG_20200619_164656_k76jjw.jpg')
  });
});