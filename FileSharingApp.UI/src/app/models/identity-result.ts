import { IdentityError } from "./identity-error";

export class IdentityResult {
    succeeded: boolean;
    errors: IdentityError[];
}