export class SnackBarItem {
    message: string;
    action: SnackbarAction;
    classType: SnackbarClassType;
    duration: SnackbarDuration;
}

export enum SnackbarAction {
    Close = 'Close',
    Open = 'Open'
}

export enum SnackbarClassType {
    Error = 'snack-bar-error',
    Info = 'snack-bar-info',
    Success = 'snack-bar-success'
}

export enum SnackbarDuration {
    Short = 2000,
    Medium = 3500,
    Long = 5000
}