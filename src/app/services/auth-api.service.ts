import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as endpoints from './uris.conf';
import { LoginToken } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient) { }

  getAuthToken(code: string): Observable<LoginToken> {
    const endpoint = endpoints.loginRequestEndpoint + '/' + encodeURIComponent(code);
    return this.http.get<LoginToken>(endpoint);
  }
}
