import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addComplaintEndpoint, getAllComplaintsEndpoint } from '../config/uris.conf';
import { Complaint } from '../interfaces/complaints.model';

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

  constructor(private http: HttpClient) { }

  addComplaint(data: ComplaintData): Observable<any> {
    return this.http.post(addComplaintEndpoint, data);
  }

  getUserComplaints(skip: number, limit: number, query?): Observable<Array<Complaint>> {
    let params = query ? new HttpParams({ fromObject: query }) : new HttpParams();
    params = params.append('skip', '' + skip);
    params = params.append('limit', '' + limit);

    return this.http.get<Array<Complaint>>(addComplaintEndpoint, {
      params: params
    });
  }

  getAllComplaints(skip: number, limit: number, query?): Observable<Array<Complaint>> {
    let params = query ? new HttpParams({ fromObject: query }) : new HttpParams();
    params = params.append('skip', '' + skip);
    params = params.append('limit', '' + limit);

    return this.http.get<Array<Complaint>>(getAllComplaintsEndpoint, {
      params: params
    });
  }

  updateStatus(id, patchObject): Observable<any> {
    return this.http.patch(addComplaintEndpoint + `/${id}`, patchObject);
  }
}
