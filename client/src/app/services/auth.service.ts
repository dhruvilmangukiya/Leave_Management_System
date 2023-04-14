import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getSessionStorageItem } from '../utils/utils'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  roles: any = {
    1: 'admin',
    2: 'hod',
    3: 'faculty',
    4: 'student'
  }

  baseUrl = 'http://localhost:3000/api/users/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  login(data: any): Observable<any>{
    return this.http.post(this.baseUrl + 'loginUser',data);
  }

  registration(formData: FormData): Observable<any>{
    return this.http.post(this.baseUrl + 'addUser', formData);
  }

  updateProfile(formData: FormData): Observable<any>{
    return this.http.put(this.baseUrl + 'updateUserProfile', formData);
  }

  // For Admin perticulor update user profile 
  updateUserById(id: any, data: any){
    return this.http.put(this.baseUrl + `updateUserById/${id}`, data);
  }

  changePassword(value: any): Observable<any>{
    return this.http.put(this.baseUrl + 'changePassword', value);
  }

  updateProfileImage(id: any,value: any): Observable<any>{
    return this.http.put(this.baseUrl + `updateProfileImage/${id}`, value);
  }

  getUserProfileById(id: any){
    return this.http.get(this.baseUrl + `getUserProfileById/${id}`);
  }

  getRole(role: any){
    return this.roles[role];
  }

  roleBasedNavigate(role: number){
    this.router.navigate([this.roles[role]]);
  }

  getroleWiseUserName(){
    return this.http.get(this.baseUrl + 'roleWiseUserName');
  }

  isLoggedIn(){
    return getSessionStorageItem('access-token')!==null;
  }

  getUserData(){
    return getSessionStorageItem('user');
  }

  getAccessToken(){
    return getSessionStorageItem('access-token');
  }

  deleteUser(id: number){
    return this.http.delete(this.baseUrl + `deleteUser/${id}`);
  }

  logoutUser(){
    sessionStorage.clear();
    this.toastr.success("Logout Successfully");
    this.router.navigate(['login']);
  }
}
