import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { StudentLeaveService } from 'src/app/services/student-leave.service';

@Component({
  selector: 'app-leave-reports',
  templateUrl: './leave-reports.component.html',
  styleUrls: ['./leave-reports.component.css']
})
export class LeaveReportsComponent implements OnInit {
  userLeaveData: any = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = this.userLeaveData.length;

  constructor(
    private leaveService: StudentLeaveService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.leaveService.getUserAllLeaveReport().subscribe({
      next: (result: any) => { 
        this.userLeaveData = result.result;
      },
      error: (error) => {
        this.toastr.error(error.error.message);   
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event;
  }

  onChange(page: any){
    this.itemsPerPage = page;
    this.currentPage = 1;
  }
}
