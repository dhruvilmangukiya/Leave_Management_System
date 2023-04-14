import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FacultyService } from 'src/app/services/faculty/faculty.service';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css']
})
export class LeaveApprovalComponent implements OnInit {
  pendingLeaveList: any = [];
  leaveApprovalForm!: FormGroup;
  submitted = false;
  updateStatusId: any;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = this.pendingLeaveList.length;
  
  constructor(
    private facultyService: FacultyService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ){}

  ngOnInit(): void {
    this.facultyService.getAllLeaveList().subscribe({
      next: (result:any) => {
        if(result){
          this.pendingLeaveList = result.result;
        }
      },
      error: (error) => {
        this.toastr.error(error.message);        
      }
    });

    this.leaveApprovalForm = this.fb.group({
      status: [ '', Validators.required ],
    });
  }

  get f(){  
    return this.leaveApprovalForm.controls;  
  }

  updateStatus(id: number){
    this.updateStatusId = id;
  }

  onSubmit(){
    this.submitted = true;
    
    if(this.leaveApprovalForm.invalid){
      return;
    }

    this.facultyService.leaveApproval(this.updateStatusId, this.leaveApprovalForm.value).subscribe({
      next: (result:any) => {
        if(result){
          const closeBtn = document.getElementById('closeBtn');
          this.toastr.success(result.message);
          closeBtn?.click();
        }
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
