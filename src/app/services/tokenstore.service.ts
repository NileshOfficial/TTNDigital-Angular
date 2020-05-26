import { Injectable } from '@angular/core';
import { LoginToken } from './auth.model';

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
