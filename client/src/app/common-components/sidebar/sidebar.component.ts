import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  role: string = '';

  constructor(
    private authService: AuthService
  ){}

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if(!userData){
      return;
    }
    this.role = this.authService.getRole(userData.role);
  }
}
