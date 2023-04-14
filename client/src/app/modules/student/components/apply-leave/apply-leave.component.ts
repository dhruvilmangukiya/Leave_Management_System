import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentLeaveService } from 'src/app/services/student-leave.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {
  applyLeaveForm!: FormGroup;
  submitted = false;
  isAddMode: boolean = true;
  id: any;
  balanceLeave: any;

  constructor(
    private leaveService: StudentLeaveService, 
    private route: ActivatedRoute,
    private toastr: ToastrService, 
    private fb: FormBuilder,
    private router: Router
  ){ 

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.leaveService.viewLeaveBalance().subscribe({
      next: (result: any) => {
        if(result){
          this.balanceLeave = result.result[0].availableLeave;
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);        
      }
    });

    this.applyLeaveForm = this.fb.group({
      startDate: [ '', Validators.required ],
      endDate: [ '', Validators.required ],
      reason: [ '', Validators.required ],
      leaveType: [ '', Validators.required ],
      requestToId: [ '', Validators.required ],
    });

    if(!this.isAddMode){
      this.leaveService.getLeaveById(this.id).subscribe({
        next: (data:any) => {
          if(data){
            const { startDate , endDate }  = data.result;

            data.result.startDate = new Date(startDate).toISOString().slice(0, 10);
            data.result.endDate = new Date(endDate).toISOString().slice(0, 10);

            this.applyLeaveForm.patchValue(data.result);
          }
        },
        error: (error) => {
          this.toastr.error(error.error.message);        
        }
      });
    }
  }
  
  onSubmit(){
    this.submitted = true;
    
    if(this.applyLeaveForm.invalid){
      return;
    }

    this.isAddMode ? this.applyLeave() : this.updateLeave();
  }

  applyLeave(){
    this.leaveService.applyLeave(this.applyLeaveForm.value).subscribe({
      next: (result) => {
        if(result){
          this.toastr.success(result.message);
          this.router.navigate(["/student/my-leave"]);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);        
      }
    });
  }

  updateLeave(){
    this.leaveService.updateMyLeave(this.id, this.applyLeaveForm.value).subscribe({
      next: (result:any) => {
        if(result){

          
          this.toastr.success(result.message);
          this.router.navigate(["/student/my-leave"]);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);        
      }
    });
  }

  get f(){  
    return this.applyLeaveForm.controls;  
  }
}
