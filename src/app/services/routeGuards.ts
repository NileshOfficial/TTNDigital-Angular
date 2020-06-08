import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenstoreService } from './tokenstore.service';
import { LocalstorageService } from './localstorage.service';
import { AuthApiService } from './auth-api.service';
import { UtilService } from './util.service';
import { invalidTokenErr } from '../errCodes.conf';

@Injectable({
    providedIn: 'root'
})
export class CheckAdminStatusGuard implements CanActivate {

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

@Injectable({
    providedIn: 'root'
})
export class DirectRouteAccessGuard implements CanActivate {

    constructor(private router: Router,
        private localstorage: LocalstorageService,
        private tokenStore: TokenstoreService,
        private authApi: AuthApiService,
        private util: UtilService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const token = this.localstorage.retrieveToken();
        if (token && token.access_token) {
            this.tokenStore.token = token;
        } else {
            this.router.navigate(['/']);
            return Promise.resolve(false);
        }

        try {
            await this.authApi.validateAuthToken().toPromise();
            return Promise.resolve(true);
        } catch (err) {
            if (err.error.errorCode === invalidTokenErr) {
                const updateResponse = await this.util.refreshAuthToken();
                if (updateResponse) return Promise.resolve(true);
            }
            this.router.navigate(['/']);
            return Promise.resolve(false);
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class GrantCodeCheckGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (route.queryParams['code'])
            return true;
        else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
