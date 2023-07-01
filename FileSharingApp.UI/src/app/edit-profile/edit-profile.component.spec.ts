import { of } from "rxjs";
import { SnackbarAction, SnackbarClassType, SnackbarDuration, SnackBarItem } from "../models/snackbar-item";
import { MessageHandlingService } from "../services/message-handling.service";
import { UserService } from "../services/user.service";
import { EditProfileComponent } from "./edit-profile.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountService } from "../services/account.service";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { User } from "../models/user";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { getMessageHandlingServiceMock } from "../shared/testing/helpers/message-handling-service-mock";
import { getAccountServiceMock } from "../shared/testing/helpers/account-service-mock";
import { getUserServiceMock } from "../shared/testing/helpers/user-service-mock";
import { selectAccountLoggedOnUser } from "../state/account/account.selectors";
import { LoadingService } from "../services/loading.service";
import { getLoadingServiceMock } from "../shared/testing/helpers/loading-service-mock";
import { AccountActions } from "../state/account/account.actions";
import { By } from "@angular/platform-browser";
import { ChangeDetectionStrategy } from "@angular/core";


describe('EditProfileComponent', () => {
  let fixture: ComponentFixture<EditProfileComponent>;
  let component: EditProfileComponent;
  let loader: HarnessLoader;
  let store: MockStore;
  let messageHandlingServiceMock: MessageHandlingService;
  let accountServiceMock: AccountService;
  let userServiceMock: UserService;
  let loadingServiceMock: LoadingService;
  let initialState: { account: { loggedOnUser: User | null } };
  const testUser = new User();
  testUser.username = "Mr Test";
  testUser.email = "Test@gmail.com";
  testUser.profilePictureUrl = "https://res.cloudinary.com/filesharingapp/image/upload/v1676504732/Placeholder_user_image_t5klyw.jpg";

  beforeEach(() => {
    messageHandlingServiceMock = getMessageHandlingServiceMock();
    accountServiceMock = getAccountServiceMock();
    userServiceMock = getUserServiceMock();
    loadingServiceMock = getLoadingServiceMock();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EditProfileComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: selectAccountLoggedOnUser,
              value: [
                {
                  loggedOnUser: testUser
                }
              ]
            }
          ]
        }),
        { provide: MessageHandlingService, useValue: messageHandlingServiceMock },
        { provide: AccountService, useValue: accountServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock }
      ]
    })
      .overrideComponent(EditProfileComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      })
      .compileComponents();
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    store = TestBed.inject(MockStore);
  });

  it('mounts', () => {
    expect(component).toBeTruthy();
  });

  describe('incorrectFileTypeSelected event', () => {
    it('should call messageHandlingService.onDisplayNewMessage method when emitted', () => {
      const snackBarItem: SnackBarItem = {
        message: "File selected must be JPEG or PNG file",
        action: SnackbarAction.Close,
        classType: SnackbarClassType.Error,
        duration: SnackbarDuration.Medium
      };
  
      fixture.debugElement.query(By.css('app-edit-profile-card')).triggerEventHandler('incorrectFileTypeSelected');
  
      expect(messageHandlingServiceMock.onDisplayNewMessage).toHaveBeenCalledWith(snackBarItem);
    });
  });

  describe('newImageSelected event', () => {
    it('should dispatch setLoggedOnUser action when emitted', () => {
      component.loggedOnUser$ = of(testUser);
      spyOn(store, 'dispatch');
      const file = new File([], 'dummy.jpg');
      const mockEvent = { target: {files: [file] } }
      // component.uploadProfilePicture(file);
      fixture.debugElement.query(By.css('app-edit-profile-card')).triggerEventHandler('newImageSelected', mockEvent);
  
      expect(store.dispatch).toHaveBeenCalled();
    }); 
    it('should call messageHandlingService.onDisplayNewMessage method when Identity result is succeeded', () => {
      component.loggedOnUser$ = of(testUser);
      const file = new File([], 'dummy.jpg');
      const snackBarItem: SnackBarItem = {
        message: "Successfully Updated",
        action: SnackbarAction.Close,
        classType: SnackbarClassType.Success,
        duration: SnackbarDuration.Medium
      };
  
      component.uploadProfilePicture(file);
  
      expect(messageHandlingServiceMock.onDisplayNewMessage).toHaveBeenCalledWith(snackBarItem);
    });
  });

  describe('updating profile loading spinner', () => {
    it('should be displayed when image is uploading', async () => {
      component.updatingProfile$ = of(true);
      expect(await loader.getHarness(MatProgressSpinnerHarness)).toBeTruthy();
    });
    it('should not be displayed when image is not uploading', async () => {
      component.updatingProfile$ = of(false);
      fixture.detectChanges();
      expect(await loader.getHarnessOrNull(MatProgressSpinnerHarness.with({selector: '.updating-profile-spinner'}))).toBeNull();
    });
  });

  describe('infoUpdated event', () => {
    it('should dispatch setLoggedOnUser action when emitted and identity result returns succeeded', () => {
      spyOn(store, 'dispatch');
      fixture.debugElement.query(By.css('app-edit-profile-info')).triggerEventHandler('infoUpdated', testUser);
      expect(store.dispatch).toHaveBeenCalledWith(AccountActions.setLoggedOnUser({ user: testUser }));
    });
    it('should call messageHandlingService.onDisplayNewMessage method when emitted and identity result returns succeeded', () => {
      const snackBarItem: SnackBarItem = {
        message: "Successfully Updated",
        action: SnackbarAction.Close,
        classType: SnackbarClassType.Success,
        duration: SnackbarDuration.Medium
      };
  
      spyOn(store, 'dispatch');
      fixture.debugElement.query(By.css('app-edit-profile-info')).triggerEventHandler('infoUpdated', testUser);
  
      expect(messageHandlingServiceMock.onDisplayNewMessage).toHaveBeenCalledWith(snackBarItem);
    });
  })

});
