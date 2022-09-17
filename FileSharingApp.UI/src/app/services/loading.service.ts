import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  setIsLoading(loadingSubName: string, loading: boolean) {
    this.loadingSubs[loadingSubName as keyof typeof this.loadingSubs].next(loading);
  }
}
