import { Injectable } from '@angular/core';
import { filter, Observable, scan, startWith, Subject } from 'rxjs';

export enum LoadingObsName {
  CHECKING_EMAIL = 'checkingEmail$',
  CHECKING_USERNAME = 'checkingUsername$'
}
@Injectable({
  providedIn: 'root'
})

export class LoadingService {

  private toggleLoadingObs$ = new Subject<LoadingObsName>();

  private loadingObs: Map<LoadingObsName, Observable<boolean>> = new Map([
    [LoadingObsName.CHECKING_EMAIL, this.setupObservable(LoadingObsName.CHECKING_EMAIL)],
    [LoadingObsName.CHECKING_USERNAME, this.setupObservable(LoadingObsName.CHECKING_USERNAME)]
  ]);

  private setupObservable(loadingObs: LoadingObsName): Observable<boolean> {
    return this.toggleLoadingObs$.pipe(
      filter(loadingObservableType => loadingObservableType == loadingObs),
      scan(previous => !previous, false),
      startWith(false)
    )
  }

  toggleLoadingObs(loadingObs: LoadingObsName) {
    this.toggleLoadingObs$.next(loadingObs);
  }

  getLoadingObs(loadingObsType: LoadingObsName) {
    return this.loadingObs.get(loadingObsType);
  }
}
