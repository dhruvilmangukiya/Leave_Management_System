import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultyRoutingModule } from './faculty-routing.module';
import { FacultyDashboardComponent } from './components/faculty-dashboard/faculty-dashboard.component';
import { LeaveApprovalComponent } from './components/leave-approval/leave-approval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    FacultyDashboardComponent,
    LeaveApprovalComponent
  ],
  imports: [
    CommonModule,
    FacultyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class FacultyModule { }
