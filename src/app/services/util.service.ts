import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalstorageService } from './localstorage.service';
import { refreshTokenEndpoint } from './uris.conf';
import { LoginToken } from './auth.model';
import { TokenstoreService } from './tokenstore.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http: HttpClient,
    private localstorage: LocalstorageService,
    private tokenstore: TokenstoreService,
    private router: Router) { }

  async refreshAuthToken(callback?: Function, args: any[] = []): Promise<boolean> {
    const token = this.localstorage.retrieveToken();
    if (token && token.refresh_token) {

      try {
        const body = {
          refreshToken: token.refresh_token
        };

        const newToken = await this.http.post<LoginToken>(refreshTokenEndpoint, body).toPromise();
        console.log(newToken);
        newToken['refresh_token'] = token.refresh_token;
        newToken['id_token'] = token.id_token;
        newToken['admin'] = token.admin;
        
        this.localstorage.storeToken(newToken);
        this.tokenstore.token = newToken;

        if (callback)
          callback(...args);
        
          return Promise.resolve(true);
      } catch (err) {
        this.router.navigate(['/']);
        Promise.resolve(false);
      }
    } else {
      this.router.navigate(['/']);
      Promise.resolve(false);
    }
  }
}
