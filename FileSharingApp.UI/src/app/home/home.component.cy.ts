import { HomeComponent } from "./home.component";

describe('HomeComponent', () => {
  it('mounts', () => {
    cy.mount(HomeComponent)
  })
})