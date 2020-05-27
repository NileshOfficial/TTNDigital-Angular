import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as endpoints from './uris.conf';
import { Observable } from 'rxjs';
import { TokenstoreService } from './tokenstore.service';
import { buzz } from '../interfaces/buzz.model';

@Injectable({
  providedIn: 'root'
})
export class BuzzApiService {

  constructor(private http: HttpClient,
    private tokenstore: TokenstoreService) { }

  postBuzz(formData: FormData): Observable<any> {
    const token = this.tokenstore.token
    let headers = new HttpHeaders({
      'authorization': `bearer ${token.access_token},bearer ${token.id_token}`
    });
    return this.http.post(endpoints.buzzPostEndpoint, formData, {
      headers: headers
    });
  }

  getBuzzFeed(): Observable<Array<buzz>> {
    const token = this.tokenstore.token
    let headers = new HttpHeaders({
      'authorization': `bearer ${token.access_token},bearer ${token.id_token}`
    });
    return this.http.get<Array<buzz>>(endpoints.buzzPostEndpoint, {
      headers: headers
    });
  }
}
