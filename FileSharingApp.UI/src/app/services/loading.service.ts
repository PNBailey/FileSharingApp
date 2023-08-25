import { Injectable } from '@angular/core';
import { filter, Observable, scan, Subject } from 'rxjs';

export enum LoadingObsName {
  CHECKING_EMAIL = 'checkingEmail$',
  CHECKING_USERNAME = 'checkingUsername$',
  UPDATING_PROFILE = 'updatingProfile$'
}
@Injectable({
    providedIn: 'root'
})

export class LoadingService {

    private toggleLoadingObs$ = new Subject<LoadingObsName>();

    private loadingObs: Map<LoadingObsName, Observable<boolean>> = new Map([
        [LoadingObsName.CHECKING_EMAIL, this.setupObservable(LoadingObsName.CHECKING_EMAIL)],
        [LoadingObsName.CHECKING_USERNAME, this.setupObservable(LoadingObsName.CHECKING_USERNAME)],
        [LoadingObsName.UPDATING_PROFILE, this.setupObservable(LoadingObsName.UPDATING_PROFILE)]
    ]);

    private setupObservable(loadingObsName: LoadingObsName): Observable<boolean> {
        return this.toggleLoadingObs$.pipe(
            filter(loadingObservableToFilter => loadingObservableToFilter == loadingObsName),
            scan(previous => !previous, false)
        )
    }

    toggleLoadingObs(loadingObsName: LoadingObsName) {        
        this.toggleLoadingObs$.next(loadingObsName);
    }

    getLoadingObs(loadingObsName: LoadingObsName) {
        return this.loadingObs.get(loadingObsName);
    }
}
