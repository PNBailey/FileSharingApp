// import { of, tap } from "rxjs";
// import { IdentityResult } from "../models/identityResult";
// import { SnackbarAction, SnackbarClassType, SnackbarDuration, SnackBarItem } from "../models/snackbar-item";
// import { MessageHandlingService } from "../services/message-handling.service";
// import { UserService } from "../services/user.service";
// import { setupCypressConfig } from "../shared/testing/cypress-config-setup/cypress-config-setup";
// import { EditProfileComponent } from "./edit-profile.component";

// describe('EditProfileComponent', () => {
//     it('mounts', () => {
//         cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>())
//     });

//     const elementBindings = {
//         editProfileCardComponent: '[data-cy="edit-profile-card-component"]',
//         container: '[data-cy="container"]',
//         updatingProfileSpinner: '[data-cy="updating-profile-spinner"]',
//         editProfileInfoComponent: '[data-cy="edit-profile-info-component"]'
//     }

//     const messageHandlingService = {
//         onDisplayNewMessage: (snackBarItem: SnackBarItem) => {
//             return snackBarItem;
//         }
//     }

//     const userService = {
//         uploadProfilePicture: (file: File) => {
//             return of(file);
//         },
//         updateUserInfo: () => {
//             const identityResult = new IdentityResult();
//             identityResult.succeeded = true;
//             return of(identityResult).pipe(
//                 tap((res: IdentityResult) => {
//                   if(res.succeeded) {
//                     accountService.setLoggedOnUser();
//                     messageHandlingService.onDisplayNewMessage({
//                         message: "Successfully Updated",
//                         action: SnackbarAction.Close,
//                         classType: SnackbarClassType.Success,
//                         duration: SnackbarDuration.Medium
//                       });
//                   }
//                 })
//             )
//         }
//     }

//     const accountService = {
//         setLoggedOnUser: () => {
//             return null;
//         }
//     };

//     beforeEach(() => {
//         cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
//             providers: [
//                 {provide: MessageHandlingService, useValue: messageHandlingService},
//                 {provide: UserService, useValue: userService}
//             ]
//         }));
//     });

//     it('displayIncorrectFileTypeMessage method should call onDisplayMessage method from the messageHandlingService', () => {
//         cy.spy(messageHandlingService, 'onDisplayNewMessage').as('messageHandlingService-onDisplayNewMessage-method');
//         cy.get(elementBindings.editProfileCardComponent).then((editProfileCardComponent) => {
//             editProfileCardComponent.css({
//                 width: '600px',
//                 height: '600px'
//             });
//         });
//         cy.get(elementBindings.editProfileCardComponent).trigger('incorrectFileTypeSelected');
//         cy.get('@messageHandlingService-onDisplayNewMessage-method').should('have.been.calledOnceWithExactly', {
//             message: "File selected must be JPEG or PNG file",
//             action: SnackbarAction.Close,
//             classType: SnackbarClassType.Error,
//             duration: SnackbarDuration.Medium
//         });
//     });

//     it('uploadProfilePicture method should call user service uploadProfilePicture method', () => {
//         cy.spy(userService, 'uploadProfilePicture').as('userService-uploadProfilePicture-method');
//         cy.get(elementBindings.editProfileCardComponent).then((editProfileCardComponent) => {
//             editProfileCardComponent.css({
//                 width: '600px',
//                 height: '600px'
//             });
//         });
//         cy.get(elementBindings.editProfileCardComponent).trigger('newImageSelected');
//         cy.get('@userService-uploadProfilePicture-method').should('have.been.called');
//     });

//     it('updating profile loading spinner should be displayed when image is uploading', () => {
//         cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
//             componentProperties: {
//                 updatingProfile$: of(true)
//             }
//         }));
//         cy.get(elementBindings.updatingProfileSpinner).should('be.visible');
//     });

//     it('updating profile loading spinner should not be displayed when profile is not updating', () => {
//         cy.mount(EditProfileComponent, setupCypressConfig<EditProfileComponent>({
//             componentProperties: {
//                 updatingProfile$: of(false)
//             }
//         }));
//         cy.get(elementBindings.updatingProfileSpinner).should('have.length', 0);
//     });

//     it('UserService updateUserInfo method is called when infoUpdated event is triggered', () => {
//         cy.spy(userService, 'updateUserInfo').as('userService-updateUserInfo-method');
//         cy.get(elementBindings.editProfileInfoComponent).then((editProfileInfoComponent) => {
//             editProfileInfoComponent.css({
//                 width: '600px',
//                 height: '600px'
//             });
//         });
//         cy.get(elementBindings.editProfileInfoComponent).trigger('infoUpdated', {force: true});
//         cy.get('@userService-updateUserInfo-method').should('have.been.called');
//     });

//     it('AccountService updateUserInfo method is called when infoUpdated event is triggered', () => {
//         cy.spy(accountService, 'setLoggedOnUser').as('accountService-setLoggedOnUser-method');
//         cy.get(elementBindings.editProfileInfoComponent).then((editProfileInfoComponent) => {
//             editProfileInfoComponent.css({
//                 width: '600px',
//                 height: '600px'
//             });
//         });
//         cy.get(elementBindings.editProfileInfoComponent).trigger('infoUpdated', {force: true});
//         cy.get('@accountService-setLoggedOnUser-method').should('have.been.called');
//     });

//     it('messageHandlingService onDisplayNewMessage method is called when infoUpdated event is triggered', () => {
//         cy.spy(messageHandlingService, 'onDisplayNewMessage').as('messageHandlingService-onDisplayNewMessage-method');
//         cy.get(elementBindings.editProfileInfoComponent).then((editProfileInfoComponent) => {
//             editProfileInfoComponent.css({
//                 width: '600px',
//                 height: '600px'
//             });
//         });
//         cy.get(elementBindings.editProfileInfoComponent).trigger('infoUpdated', {force: true});
//         cy.get('@messageHandlingService-onDisplayNewMessage-method').should('have.been.called');
//     });
// });

import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { IdentityResult } from "../models/identityResult";
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

  // const messageHandlingServiceMock = {
  //   onDisplayNewMessage: (snackBarItem: SnackBarItem) => {
  //     return snackBarItem;
  //   }
  // };

  // const accountServiceMock = {
  //   setLoggedOnUser: () => {
  //       return null;
  //   }
  // };

  // const userServiceMock = {
  //   uploadProfilePicture: (file: File) => {
  //     return of(file);
  //   },
  //   updateUserInfo: () => {
  //     const identityResult = new IdentityResult();
  //     identityResult.succeeded = true;
  //     return of(identityResult).pipe(
  //       tap((res: IdentityResult) => {
  //         if (res.succeeded) {
  //           accountServiceMock.setLoggedOnUser();
  //           messageHandlingServiceMock.onDisplayNewMessage({
  //             message: "Successfully Updated",
  //             action: SnackbarAction.Close,
  //             classType: SnackbarClassType.Success,
  //             duration: SnackbarDuration.Medium
  //           });
  //         }
  //       })
  //     )
  //   }
  // };

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
    }).compileComponents();
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    store = TestBed.inject(MockStore);
  });

  it('mounts', () => {
    expect(component).toBeTruthy();
  });

  it('messageHandlingService.onDisplayNewMessage method should be called when app-edit-profile-card component incorrectFileTypeSelected event is emitted', () => {
    const snackBarItem: SnackBarItem = {
      message: "File selected must be JPEG or PNG file",
      action: SnackbarAction.Close,
      classType: SnackbarClassType.Error,
      duration: SnackbarDuration.Medium
    };

    fixture.debugElement.query(By.css('app-edit-profile-card')).triggerEventHandler('incorrectFileTypeSelected');

    expect(messageHandlingServiceMock.onDisplayNewMessage).toHaveBeenCalledWith(snackBarItem);
  });

  it('setLoggedOnUser action should be dispatched when app-edit-profile-card component newImageSelected event is emitted', () => {
    component.loggedOnUser$ = of(testUser);
    spyOn(store, 'dispatch');
    const file = new File([], 'dummy.jpg');

    component.uploadProfilePicture(file);

    expect(store.dispatch).toHaveBeenCalledWith(AccountActions.setLoggedOnUser({user: testUser}));
  });

  it('uploadProfilePicture method should call messageHandlingService.onDisplayNewMessage method when Identity result is succeeded', () => {
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

  it('updating profile loading spinner should be displayed when image is uploading', async () => {
    component.updatingProfile$ = of(true);

    expect(await loader.getHarness(MatProgressSpinnerHarness)).toBeTruthy();
  });

  it('updating profile loading spinner should not be displayed when image is not uploading', async () => {
    component.updatingProfile$ = of(false);
    fixture.detectChanges();
    expect(await loader.getHarnessOrNull(MatProgressSpinnerHarness.with({selector: '.updating-profile-spinner'}))).toBeNull();
  });

  
  it('setLoggedOnUser action should be dispatched when edit profile info component infoUpdated event emitter is emitted and identity result returns succeeded', () => {
    spyOn(store, 'dispatch');
    fixture.debugElement.query(By.css('app-edit-profile-info')).triggerEventHandler('infoUpdated', testUser);
    expect(store.dispatch).toHaveBeenCalledWith(AccountActions.setLoggedOnUser({user: testUser}));
  });

  it('messageHandlingService.onDisplayNewMessage method should be called when edit profile info component infoUpdated event emitter is emitted and identity result returns succeeded', () => {
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

//   it('updating profile loading spinner should not be displayed when profile is not updating', () => {
//     component.updatingProfile$ = of(false);

//     const isSpinnerVisible = component.isUpdatingProfileSpinnerVisible();

//     expect(isSpinnerVisible).toBeFalse();
//   });

//   it('UserService updateUserInfo method is called when infoUpdated event is triggered', () => {
//     component.infoUpdated();

//     expect(userService.updateUserInfo).toHaveBeenCalled();
//   });

//   it('AccountService updateUserInfo method is called when infoUpdated event is triggered', () => {
//     component.infoUpdated();

//     expect(accountService.setLoggedOnUser).toHaveBeenCalled();
//   });

//   it('messageHandlingService onDisplayNewMessage method is called when infoUpdated event is triggered', () => {
//     component.infoUpdated();

//     expect(messageHandlingService.onDisplayNewMessage).toHaveBeenCalled();
//   });

//   it('should call setLoggedOnUser and display success message when updateUserInfo succeeds', () => {
//     const identityResult = new IdentityResult();
//     identityResult.succeeded = true;

//     spyOn(identityResult, 'succeeded').and.returnValue(true);
//     spyOn(userService, 'updateUserInfo').and.returnValue(of(identityResult));

//     component.updateUserInfo();

//     expect(accountService.setLoggedOnUser).toHaveBeenCalled();
//     expect(messageHandlingService.onDisplayNewMessage).toHaveBeenCalledWith({
//       message: "Successfully Updated",
//       action: SnackbarAction.Close,
//       classType: SnackbarClassType.Success,
//       duration: SnackbarDuration.Medium
//     });
//   });

});
