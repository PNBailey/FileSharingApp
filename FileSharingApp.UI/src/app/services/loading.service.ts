import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum LoadingObsName {
    CHECKING_EMAIL = 'checkingEmail$',
    CHECKING_USERNAME = 'checkingUsername$',
    UPDATING_PROFILE = 'updatingProfile$',
    CHECKING_FOLDERNAME = 'checkingFolderName$',
    LOADING_FILES = 'loadingFiles$'
}
@Injectable({
    providedIn: 'root'
})

export class LoadingService {

    private loadingObs: Map<LoadingObsName, BehaviorSubject<boolean>> = new Map([
        [LoadingObsName.CHECKING_EMAIL, new BehaviorSubject<boolean>(false)],
        [LoadingObsName.CHECKING_USERNAME, new BehaviorSubject<boolean>(false)],
        [LoadingObsName.UPDATING_PROFILE, new BehaviorSubject<boolean>(false)],
        [LoadingObsName.CHECKING_FOLDERNAME, new BehaviorSubject<boolean>(false)],
        [LoadingObsName.LOADING_FILES, new BehaviorSubject<boolean>(false)]
    ]);

    toggleLoadingObs(loadingObsName: LoadingObsName) {
        const loadingObs = this.loadingObs.get(loadingObsName);
        loadingObs.next(!loadingObs.value);
    }

    getLoadingObs(loadingObsName: LoadingObsName) {
        return this.loadingObs.get(loadingObsName);
    }
}
