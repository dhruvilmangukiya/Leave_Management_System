import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { setSessionStorageItem } from 'src/app/utils/utils';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm!: FormGroup;
  submitted = false;
  userId: any;
  isAddMode: boolean = true;
  

  constructor(
    private authService: AuthService, 
    private toastr: ToastrService, 
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.userId = this.route .snapshot.paramMap.get('id');
    this.isAddMode = !this.userId;

    this.addUserForm = this.fb.group({
      name: [ '', Validators.required ],
      email: [ '', [Validators.required, Validators.email] ],
      password: [ '', [Validators.required, Validators.minLength(8)] ],
      cpassword: [ '', [Validators.required, Validators.minLength(8)] ],
      gender: [ '', Validators.required ],
      phone: [ '', [Validators.required, Validators.pattern("^[0-9]{10}$")] ], 
      address: [ '', Validators.required ],
      role: [ '', Validators.required ],
    });

    if(!this.isAddMode){
      this.addUserForm.removeControl('password');
      this.addUserForm.removeControl('cpassword');

      this.authService.getUserProfileById(this.userId).subscribe({
        next: (data:any) => {
          if(data){
            if(data.result.role !== 1){ 
              this.addUserForm.addControl('department', new FormControl('', Validators.required));
            }

            if(data.result.role === 4){
              this.addUserForm.addControl('grNumber', new FormControl('', [Validators.required, Validators.pattern("^[0-9]{4}$")]));
              this.addUserForm.addControl('class', new FormControl('', Validators.required));
            }

            this.addUserForm.patchValue(data.result);
          }
        },
        error: (error) => {
          this.toastr.error(error.error.message);        
        }
      });
    }
  }
  
  onChange(role: any){
    if(role !== '1'){
      this.addUserForm.addControl('department', new FormControl('', Validators.required));
    }

    if(role === '4'){
      this.addUserForm.addControl('grNumber', new FormControl('', [Validators.required, Validators.pattern("^[0-9]{4}$")]));
      this.addUserForm.addControl('class', new FormControl('', Validators.required));
    }
  }

  onSubmit(){
    this.submitted = true;
    
    if(this.addUserForm.invalid){
      return;
    }

    this.isAddMode ? this.addUser() : this.updateUser();
  }

  addUser(){
    this.authService.registration(this.addUserForm.value).subscribe({
      next: (result) => {
        this.toastr.success(result.message);
        this.router.navigate(["/admin/manage-user"]);
      },
      error: (error) => {
        this.toastr.error(error.error.message);        
      }
    });
  }

  updateUser(){
    this.authService.updateUserById(this.userId, this.addUserForm.value).subscribe({
      next: (result:any) => {
        if(result){
          this.toastr.success(result.message);
          this.router.navigate(["/admin/manage-user"]);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);        
      }
    });
  }

  get f(){  
    return this.addUserForm.controls;  
  }  
}
