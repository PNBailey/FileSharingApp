import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginUser } from 'src/app/models/loginUser';
import { RegisterUser } from 'src/app/models/registerUser';
import { User } from 'src/app/models/user';

export const AccountDialogActions = createActionGroup({
    source: 'Account Dialog',
    events: {
        'Login Or Register': props<{user: RegisterUser | LoginUser; url: string}>(),
    }
});

export const AccountApiActions = createActionGroup({
    source: 'Account Api',
    events: {
        'Login Or Register Successful': props<{user: User}>(),
        'Login Or Register Error': props<{error: any}>(),
        'Set Logged On User': props<{user: User | null}>()
    }
});

export const AccountAppCompActions = createActionGroup({
    source: 'Account App Comp',
    events: {
        'logout': emptyProps(),
        'Set Logged On User': props<{user: User | null}>()
    }
});

export const AccountEditProfActions = createActionGroup({
    source: 'Account Edit Prof',
    events: {
        'Set Logged On User': props<{user: User | null}>()
    }
});