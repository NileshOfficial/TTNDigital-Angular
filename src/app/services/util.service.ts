import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { refreshTokenEndpoint } from './uris.conf';
import { LoginToken } from '../interfaces/auth.model';

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

@Injectable({
  providedIn: 'root'
})
export class TokenstoreService {

  private tokenData: LoginToken;
  constructor() { }


  public get token(): LoginToken {
    return this.tokenData;
  }


  public set token(token: LoginToken) {
    this.tokenData = token
  }

}

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  storeToken(token: LoginToken): void {
    localStorage.setItem('token', JSON.stringify(token));
  }

  retrieveToken(): LoginToken | null {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  }

  deleteToken() {
    localStorage.removeItem('token');
  }
}
