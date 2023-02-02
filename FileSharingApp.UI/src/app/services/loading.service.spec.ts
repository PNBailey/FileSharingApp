import { TestBed } from "@angular/core/testing"
import { observable, Observable, skip } from "rxjs";
import { LoadingObsName, LoadingService } from "./loading.service";

describe('LoadingService', () => {
    let service: LoadingService;
    let loadingObservables: Map<LoadingObsName, Observable<boolean>>;
    beforeEach(() => {
        service = TestBed.inject(LoadingService);
        loadingObservables = service['loadingObs'];
    });
    
    describe('toggleLoadingObs method', () => {
        it('should toggle the values of the observables', () => {
            loadingObservables.forEach((obs: Observable<boolean>, key: LoadingObsName) => {
                obs.pipe().subscribe(value => {
                    expect(value).toBeTruthy();
                });
                service.toggleLoadingObs(key);
            });
        });
        it('toggling the observables twice should return them to their original false value', () => {
            loadingObservables.forEach((obs: Observable<boolean>, key: LoadingObsName) => {
                obs.pipe((skip(1))).subscribe(value => {
                    expect(value).toBeFalsy();
                });
                service.toggleLoadingObs(key);
                service.toggleLoadingObs(key);
            });
        });
    });
    describe('getLoadingObs method', () => {
        it('should return an observable', () => {
            const loadingObs = service.getLoadingObs(LoadingObsName.CHECKING_EMAIL);
            expect(loadingObs).toBeInstanceOf(Observable<boolean>);
        });
    });
});