import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router, 
    private toastr: ToastrService
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(this.authService.isLoggedIn()){ 
          const url = state.url;
          const urlContent: any = url.split('/');

          const userData = this.authService.getUserData();
          const loginUserRole = this.authService.getRole(userData.role);
    
          if(loginUserRole === urlContent[1]){
              return true;
          }else{
            this.toastr.warning("You Don't have access");
            this.router.navigate([loginUserRole]);
            return false;
          }
      } else {
        this.router.navigate(['login']);
        return false;
      }
    }
}