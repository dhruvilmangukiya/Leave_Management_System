import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  role: string = '' ;

  constructor(
    private authServices: AuthService
  ){}

  ngOnInit(): void {
    const userData = this.authServices.getUserData();
    
    if(!userData){
      return;
    }
    this.role = this.authServices.getRole(userData.role);
  }

  authService = this.authServices;
}
