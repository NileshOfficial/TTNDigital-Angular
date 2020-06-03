import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenstoreService } from './tokenstore.service';
import { addComplaintEndpoint } from './uris.conf';

interface ComplaintData {
  department: string;
  title: string;
  description: string;
  files: Array<File>;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  constructor(private http: HttpClient, private tokenstore: TokenstoreService) { }

  addComplaint(data: ComplaintData): Observable<any> {
    const token = this.tokenstore.token
    let headers = new HttpHeaders({
      'authorization': `bearer ${token.access_token},bearer ${token.id_token}`
    });

    return this.http.post(addComplaintEndpoint, data, {
      headers: headers
    });
  }
}
