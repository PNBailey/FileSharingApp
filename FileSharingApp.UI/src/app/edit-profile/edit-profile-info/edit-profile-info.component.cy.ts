import { of } from 'rxjs';
import { User } from 'src/app/models/user';
import { setupCypressConfig } from 'src/app/shared/testing/cypress-config-setup/cypress-config-setup';

import { EditProfileInfoComponent } from './edit-profile-info.component';

describe('EditProfileInfoComponent', () => {

  const elementBindings = {
    formControls: '[data-cy="form-control"]',
    usernameFormControl: '[data-cy="username-input"]'
  }

  const user = new User();
  user.username = "Mr test"
  
  it('mounts', () => {
    cy.mount(EditProfileInfoComponent, setupCypressConfig<EditProfileInfoComponent>());
  });

  beforeEach(() => {
    cy.mount(EditProfileInfoComponent, setupCypressConfig<EditProfileInfoComponent>({
      componentProperties: {
        loggedOnUser$: of(user)
      }
    }));
  });

  it('form should contain 4 form controls', () => {
    cy.get(elementBindings.formControls).should('have.length', 3);
  });

  it('username form control should display users username', () => {
    cy.wait(1000);
    cy.get(elementBindings.usernameFormControl).should('have.text', 'Mr test');
  })
});
