import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  roleList: any = {
    admin: 0,
    hod: 0,
    faculty: 0,
    student: 0
  }
  
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.authService.getroleWiseUserName().subscribe({
      next: (result: any) => { 
        if(result){
          const userData = result.result;

          userData.forEach(({roles}: any) => {
            this.roleList[roles.name] += 1;
          });
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);   
      }
    });
  }
}
