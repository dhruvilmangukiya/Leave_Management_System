import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { FacultyDashboardComponent } from './components/faculty-dashboard/faculty-dashboard.component';
import { LeaveApprovalComponent } from './components/leave-approval/leave-approval.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/faculty/dashboard',
    pathMatch: 'full'
  },
  { 
    path: 'profile', 
    canActivate: [AuthGuard],
    loadChildren: () => 
      import('../profile/profile.module').then((p) => p.ProfileModule)
  },
  { 
    path: 'dashboard', 
    canActivate: [AuthGuard],
    component: FacultyDashboardComponent, 
  },
  { 
    path: 'leave-approval', 
    canActivate: [AuthGuard],
    component: LeaveApprovalComponent, 
  },
  {
    path: '**',
    redirectTo: '/faculty/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultyRoutingModule { }
