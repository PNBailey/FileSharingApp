import { of } from "rxjs";
import { IdentityResult } from "src/app/models/identityResult";
import { UserService } from "src/app/services/user.service";

export function getUserServiceMock() {
    const identityResult = new IdentityResult();
    identityResult.succeeded = true;
    return jasmine.createSpyObj<UserService>(
        'UserService',
        {
            uploadProfilePicture: of(identityResult),
            updateUserInfo: of(identityResult)
        }
    )
}