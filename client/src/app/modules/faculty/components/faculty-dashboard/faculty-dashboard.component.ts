import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FacultyService } from 'src/app/services/faculty/faculty.service';

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css']
})
export class FacultyDashboardComponent implements OnInit {
  allLeave: any;
  totalStudent: any;

  constructor(
    private facultyService: FacultyService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.facultyService.getAllLeaveList().subscribe({
      next: (result:any) => {
        if(result){
          this.allLeave = result.result.length;
          const allLeaveData = result.result

          const userLeave = allLeaveData.map((data: any) => {
            return data.userId;
          });

          const student = [...new Set(userLeave)];
          this.totalStudent = student.length;
        }
      },
      error: (error) => {
        this.toastr.error("Internal Server Error");        
      }
    });
  }
}
