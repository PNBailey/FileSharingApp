import { of, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { setupCypressConfig } from 'src/app/shared/testing/cypress-config-setup/cypress-config-setup';

import { EditProfileInfoComponent } from './edit-profile-info.component';

describe('EditProfileInfoComponent', () => {

  const elementBindings = {
    formControls: '[data-cy="form-control"]',
    usernameFormControl: '[data-cy="username-input"]',
    emailFormControl: '[data-cy="email-input"]',
    bioFormControl: '[data-cy="bio-input"]',
  }

  const user = new User();
  user.username = "Mr test";
  user.bio = "My Bio";
  user.email = "TestEmail@gmail.com";
  
  it('mounts', () => {
    cy.mount(EditProfileInfoComponent, setupCypressConfig<EditProfileInfoComponent>({
      componentProperties: {
        loggedOnUser$: of(user)
      }
    }));
  });

  beforeEach(() => {
    cy.mount(EditProfileInfoComponent, setupCypressConfig<EditProfileInfoComponent>({
      componentProperties: {
        loggedOnUser$: of(user)
      }
    }));
  });

  it('form should contain 3 form controls', () => {
    cy.get('input').should('have.length', 2);
    cy.get('textarea').should('have.length', 1);
  });

  it('form initial values should be set with users info', () => {
    cy.get(elementBindings.usernameFormControl).should('have.value', 'Mr test');
    cy.get(elementBindings.emailFormControl).should('have.value', 'TestEmail@gmail.com');
    cy.get(elementBindings.bioFormControl).should('have.value', 'My Bio');
  });

  
  it('should update user information when Save Changes button is clicked', () => {
    const updatedUser = {
      ...user,
      bio: 'New Bio',
      email: 'new-email@gmail.com'
    };
    cy.get(elementBindings.bioFormControl).clear().type(updatedUser.bio);
    cy.get(elementBindings.emailFormControl).clear().type(updatedUser.email);
    cy.get('button').contains('Save Changes').click();
    cy.get('@infoUpdatedSpy').should('be.calledWith', updatedUser);
  });

  it('should update updatedUser object when form value changes', () => {
    cy.mount(EditProfileInfoComponent, setupCypressConfig<EditProfileInfoComponent>({
      componentProperties: {
        loggedOnUser$: of(user)
      }
    })).then(component => {
      component.fixture.componentInstance.userInfoForm$.pipe(
        tap(form => {
          form.valueChanges.subscribe(() => {
            expect(component.fixture.componentInstance.updatedUser.bio).to.be.equal("testing 123");
          })
        })
      )
      cy.get(elementBindings.bioFormControl).clear().type("testing 123");
    });
  });
});
