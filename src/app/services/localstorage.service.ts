import { Injectable } from '@angular/core';
import { LoginToken } from './auth.model';

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
}
