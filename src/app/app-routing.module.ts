import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupScreenComponent } from './signup-screen/signup-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';

const routes: Routes = [{path:'', component: LoginScreenComponent},
                        {path:'app-signup-screen', component: SignupScreenComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
