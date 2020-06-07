import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as endpoints from './uris.conf';
import { Observable } from 'rxjs';
import { buzz } from '../interfaces/buzz.model';

@Injectable({
  providedIn: 'root'
})
export class BuzzApiService {

  constructor(private http: HttpClient) { }

  postBuzz(formData: FormData): Observable<any> {
    return this.http.post(endpoints.buzzPostEndpoint, formData);
  }

  getBuzzFeed(skip: number, limit: number): Observable<Array<buzz>> {
    return this.http.get<Array<buzz>>(endpoints.buzzPostEndpoint + `?skip=${skip}&limit=${limit}`);
  }

  updateReview(docId: string, reverse: boolean, type: string = 'like', ): Observable<any> {
    const uri = (type === 'like')
      ? `${endpoints.updateLikeEndpoint}/${docId}${reverse ? '?reverse=1' : ''}`
      : `${endpoints.updateDislikeEndpoint}/${docId}${reverse ? '?reverse=1' : ''}`
    return this.http.patch(uri, {});
  }
}
