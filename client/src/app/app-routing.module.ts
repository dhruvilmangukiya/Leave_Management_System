import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common-components/login/login.component';
import { PageNotFoundComponent } from './common-components/page-not-found/page-not-found.component';
const routes: Routes = [
  { 
    path: '',   
    redirectTo: '/login', 
    pathMatch: 'full',
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'admin',
    loadChildren: () => 
      import('./modules/admin/admin.module').then((a) => a.AdminModule), 
  },
  { 
    path: 'student',
    loadChildren: () => 
      import('./modules/student/student.module').then((s) => s.StudentModule), 
  },
  { 
    path: 'faculty',
    loadChildren: () => 
      import('./modules/faculty/faculty.module').then((f) => f.FacultyModule), 
  },
  {
    path: '**', component: PageNotFoundComponent 
  }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
