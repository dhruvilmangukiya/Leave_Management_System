import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentLeaveService } from 'src/app/services/student-leave.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-leave',
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.css']
})
export class MyLeaveComponent implements OnInit{
  myLeave:any = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = this.myLeave.length;

  constructor(
    private leaveService: StudentLeaveService,
    private toastr: ToastrService,
    public router: Router
  ){}

  ngOnInit(): void {
    this.leaveService.getMyLeave().subscribe({
      next: (result:any) => {
        if(result){
          this.myLeave = result.result;
        }
      },
      error: (error) => {
        this.toastr.error("Internal Server Error");        
      }
    });
  }

  updateCondition(status: string, id: number){
    if(['Approved', 'Rejected'].includes(status)){
      this.toastr.error(`You can't update this leave beacuse this leave has already ${status}`);
      return;
    }
    this.router.navigate(['/student/update-leave', id]);
  }

  onLeaveDelete(id: any, status: string){
    if(['Approved', 'Rejected'].includes(status)){
      this.toastr.error(`You can't update this leave beacuse this leave has already ${status}`);
      return;
    }

    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this leave!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#0275d8",
      cancelButtonColor: "#d9534f",   
      confirmButtonText: 'Yes Delete',
      cancelButtonText: 'No Cancel'
    }).then((result) => {
      if (result.value) {
        this.leaveService.deleteMyLeave(id).subscribe({
          next: (result:any) => {
            if(result){
              Swal.fire(
                'Deleted!',
                `${result.message}`,
                'success'
              )
              this.ngOnInit();
            }
          },
          error: (error) => {
            this.toastr.error(error.error.message);        
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your leave is safe :)',
          'error'
        )
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
