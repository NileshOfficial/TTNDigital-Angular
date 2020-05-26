import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenstoreService } from './tokenstore.service';

@Injectable({
  providedIn: 'root'
})
export class CheckAdminStatusService implements CanActivate {

  constructor(private router: Router, private tokenStore: TokenstoreService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.tokenStore.token.admin)
      return true;
    else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
