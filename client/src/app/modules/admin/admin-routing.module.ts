import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { LeaveReportsComponent } from './components/leave-reports/leave-reports.component';
const routes: Routes = [
  { 
    path: '',
    redirectTo: '/admin/dashboard',
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
    component: AdminDashboardComponent, 
  },
  { 
    path: 'manage-user', 
    canActivate: [AuthGuard],
    component: ManageUserComponent, 
  },
  { 
    path: 'leave-reports', 
    canActivate: [AuthGuard],
    component: LeaveReportsComponent, 
  },
  { 
    path: 'add-user', 
    canActivate: [AuthGuard],
    component: AddUserComponent, 
  },
  { 
    path: 'update-user/:id', 
    canActivate: [AuthGuard],
    component: AddUserComponent, 
  },
  {
    path: '**',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
