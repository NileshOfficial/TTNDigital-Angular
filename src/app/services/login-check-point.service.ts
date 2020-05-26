import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { TokenstoreService } from './tokenstore.service';

@Injectable({
  providedIn: 'root'
})
export class LoginCheckPointService implements CanActivate {

  constructor(private router: Router,
    private localstorage: LocalstorageService,
    private tokenStore: TokenstoreService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const token = this.localstorage.retrieveToken();
    if(token && token.access_token) {
      this.tokenStore.token = token;
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
