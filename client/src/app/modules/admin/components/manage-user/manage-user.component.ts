import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  userData: any = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = this.userData.length;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.authService.getroleWiseUserName().subscribe({
      next: (result: any) => { 
        this.userData = result.result
      },
      error: (error) => {
        this.toastr.error(error.error.message);   
      }
    });
  }

  onUserDelete(id: any){
    Swal.fire({
      title: 'Are you sure want to delete user?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#0275d8",
      cancelButtonColor: "#d9534f",   
      confirmButtonText: 'Yes Delete',
      cancelButtonText: 'No Cancel'
    }).then((result) => {
      if (result.value) {
        this.authService.deleteUser(id).subscribe({
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
          'Your user is safe :)',
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