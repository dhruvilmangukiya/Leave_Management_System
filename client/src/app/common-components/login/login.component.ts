import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { setSessionStorageItem } from '../../utils/utils'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder,  
    private toastr: ToastrService
  ){
      sessionStorage.clear();
  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [ '', [Validators.required, Validators.email] ],
      password: [ '', [Validators.required, Validators.minLength(8)] ],
    })
  }
  
  onSubmit(){
    this.submitted = true;
  
    if(this.loginForm.invalid){
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (result) => { 
        if(result){
          // Store user data & token in Session Storage using function
          setSessionStorageItem('user', result.data);
          setSessionStorageItem('access-token', result.token)

          this.toastr.success(result.message);
          this.authService.roleBasedNavigate(result.data.role);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);        
      }
    });
  }

  get f(){  
    return this.loginForm.controls;  
  }  
}
