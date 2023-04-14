import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentLeaveService {

  baseUrl = 'http://localhost:3000/api/leave/';

  constructor(
    private http: HttpClient
  ) { }

  applyLeave(formData: FormData): Observable<any>{
    return this.http.post(this.baseUrl + 'leaveRequest', formData);
  }

  getMyLeave(){
    return this.http.get(this.baseUrl + 'viewUserLeaveStatus');
  }

  getLeaveById(id: number){
    return this.http.get(this.baseUrl + `getLeaveById/${id}`);
  }

  updateMyLeave(id: number, value: any){
    return this.http.put(this.baseUrl + `leaveUpdate/${id}`, value);
  }

  deleteMyLeave(id: number){
    return this.http.delete(this.baseUrl + `leaveDelete/${id}`);
  }

  viewLeaveBalance(){
    return this.http.get(this.baseUrl + 'viewLeaveBalance');
  }

  getUserAllLeaveReport(){
    return this.http.get(this.baseUrl + 'getUserAllLeaveReport');
  }
}
