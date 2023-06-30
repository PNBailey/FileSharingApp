import { of } from "rxjs";
import { User } from "src/app/models/user";
import { EditProfileCardComponent } from "./edit-profile-card.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

describe("EditProfileCardComponent", () => {
  let component: EditProfileCardComponent;
  let fixture: ComponentFixture<EditProfileCardComponent>;
  const mockUser = new User();
  mockUser.id = 0;
  mockUser.bio = "test";
  mockUser.profilePictureUrl = "";
  mockUser.token = "testToken";
  mockUser.username = "testUser";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditProfileCardComponent]
    });
    fixture = TestBed.createComponent(EditProfileCardComponent);
    component = fixture.componentInstance;
    component.loggedOnUser$ = of(mockUser);
    fixture.detectChanges();
  });

  it("should mount", () => {
    expect(component).toBeDefined();
  });

  it("should contain bio for user", () => {
    const bioElement = fixture.debugElement.query(By.css('.bio')).nativeElement.textContent;
    expect(bioElement).toContain('test');
  });

  it("should have default placeholder image when user profile picture is null", () => {
    const profilePictureElement = fixture.debugElement.query(By.css('.profile-picture')).nativeElement;
    const placeholderImageUrl = "https://res.cloudinary.com/filesharingapp/image/upload/v1676504732/Placeholder_user_image_t5klyw.jpg";
    expect(profilePictureElement.getAttribute("src")).toContain(placeholderImageUrl);
  });

  it("should display the user's profile picture", () => {
    const profilePictureElement = fixture.debugElement.query(By.css('.profile-picture')).nativeElement;
    const profilePictureUrl = "https://res.cloudinary.com/filesharingapp/image/upload/v1677632350/Application%20Assets/IMG_20200619_164656_k76jjw.jpg";
    const newUser = new User();
    newUser.profilePictureUrl = profilePictureUrl;
    component.loggedOnUser$ = of(newUser);
    fixture.detectChanges();
    expect(profilePictureElement.getAttribute("src")).toContain(profilePictureUrl);
  });

  it("should call incorrectFileTypeSelected event emitter when onFileSelected method is invoked with an incorrect file type", () => {
    const file = new File([""], "file.webp", { type: "image/webp" });
    const mockEvent = { target: {files: [file] } }
    spyOn(component.incorrectFileTypeSelected, "emit");
    component.onFileSelected(mockEvent as any);
    expect(component.incorrectFileTypeSelected.emit).toHaveBeenCalled();
  });

  it("should call newImageSelected event emitter when onFileSelected method is invoked with a valid image file", () => {
    const file = new File([""], "image.jpg", { type: "image/jpeg" });
    const mockEvent = { target: {files: [file] } }
    spyOn(component.newImageSelected, "emit");
    component.onFileSelected(mockEvent as any);
    expect(component.newImageSelected.emit).toHaveBeenCalled();
  });
});

