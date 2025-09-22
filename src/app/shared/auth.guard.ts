import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { GlobalStore } from '../global-store';

@Injectable()
export class AuthGuard {
  constructor(private router: Router, private globalStorage: GlobalStore) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.globalStorage.token$.pipe(
      map(token => {
        if (token && token != '') {
          return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
      })
    );
  }
}
