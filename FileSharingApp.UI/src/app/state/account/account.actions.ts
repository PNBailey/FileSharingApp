import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginUser } from 'src/app/models/login-user';
import { RegisterUser } from 'src/app/models/register-user';
import { User } from 'src/app/models/user';

export const AccountDialogActions = createActionGroup({
    source: 'Account Dialog',
    events: {
        'Login Or Register': props<{user: RegisterUser | LoginUser; url: string}>(),
    }
});

export const AccountActions = createActionGroup({
    source: 'Account Api',
    events: {
        'Set Logged On User': props<{user: User | null}>()
    }
});

export const AccountApiActions = createActionGroup({
    source: 'Account Api',
    events: {
        'Login Or Register Successful': props<{user: User}>(),
        'Login Or Register Error': props<{error: any}>(),
    }
});

export const AccountAppCompActions = createActionGroup({
    source: 'Account App Comp',
    events: {
        'logout': emptyProps(),
    }
});