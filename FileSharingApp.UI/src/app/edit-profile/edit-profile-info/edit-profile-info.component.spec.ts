import { of } from 'rxjs';
import { User } from 'src/app/models/user';

import { EditProfileInfoComponent } from './edit-profile-info.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { ValidationService } from 'src/app/services/validation.service';
import { getValidationServiceMock } from 'src/app/shared/testing/helpers/validation-service-mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('EditProfileInfoComponent', () => {
  let component: EditProfileInfoComponent;
  let fixture: ComponentFixture<EditProfileInfoComponent>;
  let user: User;
  let loader: HarnessLoader;
  let validationServiceMock: ValidationService;

  beforeEach(() => {
    user = new User();
    user.username = "Mr test";
    user.bio = "My Bio";
    user.email = "TestEmail@gmail.com";
    validationServiceMock = getValidationServiceMock();

    TestBed.configureTestingModule({
      imports: [
        EditProfileInfoComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ValidationService, useValue: validationServiceMock }
      ]
    })
    fixture = TestBed.createComponent(EditProfileInfoComponent);
    component = fixture.componentInstance;
    component.loggedOnUser$ = of(user);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should contain 3 form controls', async () => {
    expect((await loader.getAllHarnesses(MatFormFieldHarness)).length).toEqual(3);
    expect(await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }))).toBeTruthy();
    expect(await loader.getHarness(MatInputHarness.with({ selector: '.email-input' }))).toBeTruthy();
    expect(await loader.getHarness(MatInputHarness.with({ selector: '.bio-input' }))).toBeTruthy();
  });

  it('form initial values should be set with users info', async () => {
    const usernameInputValue = await (await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }))).getValue();
    const emailInputValue = await (await loader.getHarness(MatInputHarness.with({ selector: '.email-input' }))).getValue();
    const bioInputValue = await (await loader.getHarness(MatInputHarness.with({ selector: '.bio-input' }))).getValue();
    expect(usernameInputValue).toBe('Mr test');
    expect(emailInputValue).toBe('TestEmail@gmail.com');
    expect(bioInputValue).toBe('My Bio');
  });

  it('should emit infoUpdated when Save Changes button is clicked', async () => {
    spyOn(component.infoUpdated, 'emit');
    const updatedUser = {
      ...user,
      username: "username updated",
      bio: 'New Bio',
      email: 'new-email@gmail.com'
    };
    const usernameInput = await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }));
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '.email-input' }));
    const bioInput = await loader.getHarness(MatInputHarness.with({ selector: '.bio-input' }));
    await (usernameInput).setValue(updatedUser.username)
    await (emailInput).setValue(updatedUser.email);
    await (bioInput).setValue(updatedUser.bio);
    const saveChangesBtn = await loader.getHarness(MatButtonHarness.with({ selector: '.save-changes-button' }));
    await saveChangesBtn.click();
  
    expect(component.infoUpdated.emit).toHaveBeenCalledWith(updatedUser);
  });

  it('form should update components updatedUser property when value changes', async () => {
    const usernameInput = await loader.getHarness(MatInputHarness.with({ selector: '.username-input' }));
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: '.email-input' }));
    const bioInput = await loader.getHarness(MatInputHarness.with({ selector: '.bio-input' }));
    await (usernameInput).setValue("username updated")
    await (emailInput).setValue("email@updatedemail.com");
    await (bioInput).setValue("updated bio");
    
    expect(component.updatedUser.username).toBe("username updated");
    expect(component.updatedUser.email).toBe("email@updatedemail.com");
    expect(component.updatedUser.bio).toBe("updated bio");
  });
});