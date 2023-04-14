import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  signUpForm!: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService, 
    private toastr: ToastrService, 
    private fb: FormBuilder,
    private router: Router
  ){ 

  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: [ '', Validators.required ],
      email: [ '', [Validators.required, Validators.email] ],
      password: [ '', [Validators.required, Validators.minLength(8)] ],
      cpassword: [ '', [Validators.required, Validators.minLength(8)] ],
      gender: [ '', Validators.required ],
      phone: [ '', [Validators.required, Validators.pattern("^[0-9]{10}$")] ], 
      address: [ '', Validators.required ],
      grNumber: [ '', [ Validators.required, Validators.pattern("^[0-9]{4}$") ]],
      department: [ '', Validators.required ],
      class: [ '', Validators.required ],
      image: [ '', Validators.required ],
    })
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.signUpForm.patchValue({
        image: file
      });
    }
  }
  
  onSubmit(){
    this.submitted = true;
    
    if(this.signUpForm.invalid){
      return;
    }

    const formData = new FormData();
    formData.append('name', this.signUpForm.get('name')?.value);
    formData.append('email', this.signUpForm.get('email')?.value);
    formData.append('password', this.signUpForm.get('password')?.value);
    formData.append('cpassword', this.signUpForm.get('cpassword')?.value);
    formData.append('gender', this.signUpForm.get('gender')?.value);
    formData.append('phone', this.signUpForm.get('phone')?.value);
    formData.append('address', this.signUpForm.get('address')?.value);
    formData.append('grNumber', this.signUpForm.get('grNumber')?.value);
    formData.append('department', this.signUpForm.get('department')?.value);
    formData.append('class', this.signUpForm.get('class')?.value);
    formData.append('image', this.signUpForm.get('image')?.value);

    this.authService.registration(formData).subscribe({
      next: (result) => {
        this.toastr.success(result.message);
        this.router.navigate(["/login"]);
      },
      error: (error) => {
        this.toastr.error(error.error.message);        
      }
    });
  }

  get f(){  
    return this.signUpForm.controls;  
  }  
}
