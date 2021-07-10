import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdmDashboardComponent } from './adm-dashboard/adm-dashboard.component';



const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'user-dashboard/:id', component: UserDashboardComponent},
  {path: 'adm-dashboard/:id', component: AdmDashboardComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
