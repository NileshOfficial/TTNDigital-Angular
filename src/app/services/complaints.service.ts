import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenstoreService } from './tokenstore.service';
import { addComplaintEndpoint, getAllComplaintsEndpoint } from './uris.conf';
import { Complaint } from './complaints.model';

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

  getUserComplaints(skip: number, limit: number): Observable<Array<Complaint>> {
    const token = this.tokenstore.token
    let headers = new HttpHeaders({
      'authorization': `bearer ${token.access_token},bearer ${token.id_token}`
    });

    let params = new HttpParams().append('skip', '' + skip);
    params = params.append('limit', '' + limit);

    return this.http.get<Array<Complaint>>(addComplaintEndpoint, {
      headers: headers,
      params: params
    });
  }

  getAllComplaints(skip: number, limit: number): Observable<Array<Complaint>> {
    const token = this.tokenstore.token
    let headers = new HttpHeaders({
      'authorization': `bearer ${token.access_token},bearer ${token.id_token}`
    });

    let params = new HttpParams().append('skip', '' + skip);
    params = params.append('limit', '' + limit);

    return this.http.get<Array<Complaint>>(getAllComplaintsEndpoint, {
      headers: headers,
      params: params
    });
  }

  updateStatus(id, patchObject): Observable<any> {
    const token = this.tokenstore.token
    let headers = new HttpHeaders({
      'authorization': `bearer ${token.access_token},bearer ${token.id_token}`
    });

    return this.http.patch(addComplaintEndpoint + `/${id}`, patchObject, {
      headers: headers
    });
  }
}
