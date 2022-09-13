import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MasterComponent } from './master/master.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
  },
  {
      path: 'login',
      component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
