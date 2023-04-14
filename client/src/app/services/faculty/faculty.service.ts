import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  baseUrl = 'http://localhost:3000/api/leave/';
  constructor(
    private http: HttpClient
  ) { }

  getAllLeaveList(){
    return this.http.get(this.baseUrl + 'getAllLeaveList');
  }

  leaveApproval(id: number, data: any): Observable<any>{
    return this.http.put(this.baseUrl + `approvalLeaveStatus/${id}`, data);
  }
}
