import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ApplyLeaveComponent } from './components/apply-leave/apply-leave.component';
import { MyLeaveComponent } from './components/my-leave/my-leave.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/student/dashboard',
    pathMatch: 'full'
  },
  { 
    path: 'register', 
    component: RegisterComponent
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
    component: DashboardComponent, 
  },
  { 
    path: 'apply-leave', 
    canActivate: [AuthGuard],
    component: ApplyLeaveComponent, 
  },
  { 
    path: 'update-leave/:id', 
    canActivate: [AuthGuard],
    component: ApplyLeaveComponent, 
  },
  { 
    path: 'my-leave', 
    canActivate: [AuthGuard],
    component: MyLeaveComponent, 
  },
  {
    path: '**',
    redirectTo: '/student/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
