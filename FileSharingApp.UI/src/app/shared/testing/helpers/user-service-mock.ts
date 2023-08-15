import { of } from "rxjs";
import { IdentityResult } from "src/app/models/identity-result";
import { ImageUploadResult } from "src/app/models/image-upload-result";
import { UserService } from "src/app/services/user.service";

export function getUserServiceMock() {
    const identityResult = new IdentityResult();
    identityResult.succeeded = true;
    const imageUploadResult = new ImageUploadResult();
    imageUploadResult.url = "https://res.cloudinary.com/filesharingapp/image/upload/v1676504732/Placeholder_user_image_t5klyw.jpg";
    return jasmine.createSpyObj<UserService>(
        'UserService',
        {
            uploadProfilePicture: of(imageUploadResult),
            updateUserInfo: of(identityResult)
        }
    )
}