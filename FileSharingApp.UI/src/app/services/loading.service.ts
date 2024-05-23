import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum LoadingObsName {
    CHECKING_EMAIL = 'checkingEmail$',
    CHECKING_USERNAME = 'checkingUsername$',
    UPDATING_PROFILE = 'updatingProfile$',
    CHECKING_FOLDERNAME = 'checkingFolderName$',
    LOADING_FILES = 'loadingFiles$',
    UPDATING_FILE = 'updatingFile$'
}
@Injectable({
    providedIn: 'root'
})

export class LoadingService {

    private loadingObservables: Map<LoadingObsName | string, BehaviorSubject<boolean>> = new Map();

    toggleLoadingObs(loadingObsName: LoadingObsName | string) {
        const loadingObservable = this.loadingObservables.get(loadingObsName);
        loadingObservable.next(!loadingObservable.value);
    }

    getLoadingObs(loadingObsName: LoadingObsName | string) {
        this.createLoadingObsIfNotPresent(loadingObsName);
        return this.loadingObservables.get(loadingObsName);
    }

    private createLoadingObsIfNotPresent(loadingObsName: string) {
        if (!this.loadingObservables.has(loadingObsName)) {
            this.loadingObservables.set(loadingObsName, new BehaviorSubject<boolean>(false));
        }
    }
}
