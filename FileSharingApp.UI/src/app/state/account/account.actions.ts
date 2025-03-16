import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginUser } from 'src/app/models/login-user';
import { RegisterUser } from 'src/app/models/register-user';
import { User } from 'src/app/models/user';

export const AccountActions = createActionGroup({
    source: 'Account',
    events: {
        'Set Logged On User': props<{ user: User | null }>(),
        'Login Or Register': props<{ user: RegisterUser | LoginUser; url: string }>(),
        'Upload Profile Picture': props<{ file: File }>(),
        'logout': emptyProps(),
        'Update User Info': props<{ updatedUser: User }>()
    }
});

export const AccountApiActions = createActionGroup({
    source: 'Account Api',
    events: {
        'Login Or Register Successful': props<{ user: User }>(),
        'Upload Profile Picture Successful': props<{ updatedUser: User }>(),
        'Update User Info Successful': props<{ updatedUser: User }>()
    }
});