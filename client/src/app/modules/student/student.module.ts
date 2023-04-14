import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplyLeaveComponent } from './components/apply-leave/apply-leave.component';
import { MyLeaveComponent } from './components/my-leave/my-leave.component';
import { ProfileRoutingModule } from '../profile/profile-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent,
    ApplyLeaveComponent,
    MyLeaveComponent,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    NgxPaginationModule
  ],
})
export class StudentModule { }
