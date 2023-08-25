import { AccountService } from "src/app/services/account.service";

export function getAccountServiceMock() {
    return jasmine.createSpyObj<AccountService>(
        'AccountService',
        {
            loginOrRegister: undefined
        }
    )
}