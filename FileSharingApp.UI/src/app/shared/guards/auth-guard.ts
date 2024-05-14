import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/models/user';
import { getLoggedOnUser } from 'src/app/state/account/account.selectors';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {

    constructor(private store: Store, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.store.select(getLoggedOnUser).pipe(
            map((user: User) => {
                if (!user) {
                    return true;
                } else {
                    this.router.navigate(['/files']);
                    return false;
                }
            })
        );
    }
}