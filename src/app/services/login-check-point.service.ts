import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginCheckPointService implements CanActivate {

  constructor(private router: Router, private localstorage: LocalstorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const token = this.localstorage.retrieveToken();
    console.log(token);
    if(token && token.access_token) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
