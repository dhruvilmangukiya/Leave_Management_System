import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentLeaveService } from 'src/app/services/student-leave.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalLeave: any;
  leaveList: any = {
    Pending: 0,
    Approved: 0,
    Rejected: 0,
  }

  constructor(
    private studentService: StudentLeaveService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.studentService.getMyLeave().subscribe({
      next: (result:any) => {
        if(result){
          this.totalLeave = result.result.length;
          const allLeave = result.result;
          
          allLeave.forEach(({status}: any) => { 
            this.leaveList[status] += 1;
          });
        }
      },
      error: (error) => {
        this.toastr.error("Internal Server Error");        
      }
    });
  }
}
