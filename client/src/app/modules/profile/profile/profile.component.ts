import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { setSessionStorageItem } from 'src/app/utils/utils';

declare var window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: any;
  formModal: any;
  changePwdModal: any;
  updateProfileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  submitted = false;
  role: any;
  profileBasePath: any = `http://localhost:3000/public/userImages/`;
  profileImage: any

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private toastr: ToastrService, 
    private router: Router
  ){}

  ngOnInit(): void {
    this.profileData = this.authService.getUserData();
    this.role = this.authService.getRole(this.profileData.role);
    this.profileImage = this.profileBasePath + (this.profileData.image ? this.profileData.image : 'userImg.svg');
    
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('updateProfileModal')
    );

    this.changePwdModal = new window.bootstrap.Modal(
      document.getElementById('changePasswordModal')
    );

    this.updateProfileForm = this.fb.group({
      name: [ '', Validators.required ],
      email: [ '', [Validators.required, Validators.email] ],
      gender: [ '', Validators.required ],
      phone: [ '', [Validators.required, Validators.pattern("^[0-9]{10}$")] ], 
      address: [ '', Validators.required ],
    })

    this.changePasswordForm = this.fb.group({
      oldpwd: [ '', [Validators.required, Validators.minLength(8)] ],
      newpwd: [ '', [Validators.required, Validators.minLength(8)] ],
      cpwd: [ '', [Validators.required, Validators.minLength(8)] ],
    })

    if(this.role === 'student'){
      this.updateProfileForm.addControl('grNumber', new FormControl('', [Validators.required, Validators.pattern("^[0-9]{4}$")]));
      this.updateProfileForm.addControl('class', new FormControl('', Validators.required));
    }

    if(this.role !== 'admin'){
      this.updateProfileForm.addControl('department', new FormControl('', Validators.required));
    }
  }

  onUpdateProfileImage() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

 
  onFileSelected(id: any, event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append('image', file);
      
      this.authService.updateProfileImage(id, formData).subscribe({
        next: (result) => {
          if(result){
            this.authService.getUserProfileById(this.profileData.id).subscribe({
              next: (result:any) => { 
                if(result){
                  setSessionStorageItem('user', result.result);
                  const userInfo = this.authService.getUserData();
                  this.profileImage = this.profileBasePath + (userInfo.image ? userInfo.image : 'userImg.svg'); 
                }
              },
              error: (error) => {
                this.toastr.error(error.error.message);        
              }
            });

            this.toastr.success(result.message);
          }
        },
        error: (error) => {
          this.toastr.error(error.error.message);        
        }
      })
    }
  }

  get f(){  
    return this.updateProfileForm.controls;  
  }  

  get c(){  
    return this.changePasswordForm.controls;  
  }  

  onChangePassword(){
    this.changePwdModal.show();
  }

  onUpdatePassword(){
    const closeBtn: any = document.getElementById('closeBtn');
    this.submitted = true;
    
    if(this.changePasswordForm.invalid){
      return;
    }

    this.authService.changePassword(this.changePasswordForm.value).subscribe({
      next: (result) => { 
        this.toastr.success(result.message);
        closeBtn.click();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toastr.error(error.error.message); 
        closeBtn.click();  
        this.changePasswordForm.reset();
      }
    });    
  }

  onEditProfile(){
    this.formModal.show();
    this.updateProfileForm.patchValue(this.profileData);
  }

  onUpdateProfile(){
    this.submitted = true;
    
    if(this.updateProfileForm.invalid){
      return;
    }
    
    this.authService.updateProfile(this.updateProfileForm.value).subscribe({
      next: (result) => {
        if(result){
          this.authService.getUserProfileById(this.profileData.id).subscribe({
            next: (result:any) => { 
              if(result){
                setSessionStorageItem('user', result.result);
              }
            },
            error: (error) => {
              this.toastr.error(error.error.message);        
            }
          });
        }

        const closeBtn: any = document.getElementById('closeBtns');
        closeBtn.click();  
        this.updateProfileForm.reset();
        this.toastr.success(result.message);
      },
      error: (error) => {
        this.toastr.error(error.error.message);        
      }
    });
  }
}
