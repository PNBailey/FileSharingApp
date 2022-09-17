import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubs = {
    checkingEmail: new BehaviorSubject<boolean>(false),
    checkingUsername: new BehaviorSubject<boolean>(false)
  }

  loadingObs = {
    checkingEmail$: this.loadingSubs.checkingEmail.asObservable(),
    checkingUsername$: this.loadingSubs.checkingUsername.asObservable()
  }

  constructor() { }

  setIsLoading(loadingSubName: string, loading: boolean) {
    this.loadingSubs[loadingSubName].next(loading);
  }
}
