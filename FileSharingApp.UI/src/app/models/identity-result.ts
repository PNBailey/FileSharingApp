import { IdentityError } from "./identityError";

export class IdentityResult {
    succeeded: boolean;
    errors: IdentityError[];
}