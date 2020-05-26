import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalstorageService } from './localstorage.service';
import { refreshTokenEndpoint } from './uris.conf';
import { LoginToken } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http: HttpClient,
    private localstorage: LocalstorageService,
    private router: Router) { }

  async refreshAuthToken(callback?: Function, args: any[] = []) {
    const token = this.localstorage.retrieveToken();
    if (token && token.refresh_token) {
      try {
        const body = {
          refreshToken: token.refresh_token
        };
        const newToken = await this.http.post<LoginToken>(refreshTokenEndpoint, body).toPromise();
        this.localstorage.storeToken(newToken);
        if (callback && args)
          callback(...args);
      } catch (err) {
        this.router.navigate(['/']);
      }
    }
  }
}
