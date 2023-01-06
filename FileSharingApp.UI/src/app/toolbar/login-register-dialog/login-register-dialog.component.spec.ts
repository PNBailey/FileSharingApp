import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "src/app/shared/angular-material.module";
import { LoginRegisterDialogComponent } from "./login-register-dialog.component";

describe('LoginRegisterDialogComponent', () => {
let component: LoginRegisterDialogComponent;
let fixture: ComponentFixture<LoginRegisterDialogComponent>;


beforeEach(async () => {
    await TestBed.configureTestingModule({
        providers: [ UntypedFormBuilder ],
        imports: [ 
            HttpClientTestingModule, 
            ReactiveFormsModule,
            AngularMaterialModule,
            BrowserAnimationsModule
        ],
        declarations: [ LoginRegisterDialogComponent ]
    })
    .compileComponents();
});

beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegisterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
});

describe('buildRegisterForm', () => {
    
    beforeEach(() => {
        component.buildRegisterForm();
    });

    it('should create a form object', () => {
        //Assert
        expect(component.registerForm).toBeInstanceOf(FormGroup);
    });

    it('should contain 3 form controls', () => {
        //Assert
        expect(Object.keys(component.registerForm.controls).length).toEqual(3);
    });

    it('form should be invalid when all values are empty', () => {
        //Act
        component.registerForm.controls['username'].setValue("");
        component.registerForm.controls['password'].setValue("");
        component.registerForm.controls['email'].setValue("");
        //Assert
        expect(component.registerForm.valid).toBeFalsy();
    });

        describe('username form control', () => {

            it('should be invalid when value is an empty string', () => {
                //Act
                component.registerForm.controls['username'].setValue("");
                //Assert
                expect(component.registerForm.controls['username'].invalid).toBeTruthy();
            });
        });

        describe('password form control', () => {

            it('should be invalid when value is an empty string', () => {
                //Act
                component.registerForm.controls['password'].setValue("");
                //Assert
                expect(component.registerForm.controls['password'].invalid).toBeTruthy();
            });

            it('should be invalid when password is less than 8 characters', () => {
                //Act
                component.registerForm.controls['password'].setValue("$hort1");
                //Assert
                expect(component.registerForm.controls['password'].invalid).toBeTruthy();
            });

            it('should be invalid when password does not contain an upper case letter', () => {
                //Act
                component.registerForm.controls['password'].setValue("-1upperc@se");
                //Assert
                expect(component.registerForm.controls['password'].invalid).toBeTruthy();
            });

            it('should be invalid when password does not contain an upper case letter', () => {
                //Act
                component.registerForm.controls['password'].setValue("-1LOWERC@ASE");
                //Assert
                expect(component.registerForm.controls['password'].invalid).toBeTruthy();
            });

            it('should be invalid when password does not contain a special character', () => {
                //Act
                component.registerForm.controls['password'].setValue("NotEven1SpecialCharacter");
                //Assert
                expect(component.registerForm.controls['password'].invalid).toBeTruthy();
            });

            it('should be invalid when password does not contain a number', () => {
                //Act
                component.registerForm.controls['password'].setValue("NoNumber$Included");
                //Assert
                expect(component.registerForm.controls['password'].invalid).toBeTruthy();
            });

            it('should be valid when all regex conditions met', () => {
                //Act
                component.registerForm.controls['password'].setValue("AllCondition$Met1");
                //Assert
                expect(component.registerForm.controls['password'].valid).toBeTruthy();
            });
        });

        describe('email form control', () => {

            it('should be invalid when value is an empty string', () => {
                //Act
                component.registerForm.controls['email'].setValue("");
                //Assert
                expect(component.registerForm.controls['email'].invalid).toBeTruthy();
            });

            it('should be invalid when value is not a valid email', () => {
                //Act
                component.registerForm.controls['email'].setValue("TestEmailATgmail.com");
                //Assert
                expect(component.registerForm.controls['email'].invalid).toBeTruthy();
            });
        });
    });
});