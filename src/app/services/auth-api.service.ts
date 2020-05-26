import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as endpoints from './uris.conf';
import { LoginToken } from './auth.model';
import { TokenstoreService } from './tokenstore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient,
    private tokenstore: TokenstoreService) { }

  getAuthToken(code: string): Observable<LoginToken> {
    const endpoint = endpoints.loginRequestEndpoint + '/' + encodeURIComponent(code);
    return this.http.get<LoginToken>(endpoint);
  }

  logout() {
    const body = {
      refreshToken: this.tokenstore.token.refresh_token
    }
    return this.http.post(endpoints.logoutEndpoint, body);
  }

  isAdmin(token: string, idToken: string): Observable<{ admin: boolean }> {
    let headers = new HttpHeaders({
      'authorization': `bearer ${token},bearer ${idToken}`
    });

    return this.http.get<{ admin: boolean }>(endpoints.adminCheckEndpoint, {
      headers: headers
    });
  }
}
