import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupScreenComponent } from './signup-screen/signup-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { PasswordResetScreenComponent } from './password-reset-screen/password-reset-screen.component';
import { UserManagementScreenComponent } from './user-management-screen/user-management-screen.component';

const routes: Routes = [{path:'', component: LoginScreenComponent},
                        {path:'app-signup-screen/:id', component: SignupScreenComponent},
                        {path:'app-project-list', component: ProjectListComponent},
                        {path:'app-password-reset-screen', component: PasswordResetScreenComponent},
                        {path:'app-user-management-screen/:id', component: UserManagementScreenComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
