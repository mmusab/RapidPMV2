import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupScreenComponent } from './signup-screen/signup-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { PasswordResetScreenComponent } from './password-reset-screen/password-reset-screen.component';
import { UserManagementScreenComponent } from './user-management-screen/user-management-screen.component';
import { CompanyListScreenComponent } from './company-list-screen/company-list-screen.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectContentComponent } from './project-content/project-content.component';
import { ArtefactDetailsComponent } from './artefact-details/artefact-details.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DirtyCheckGuard } from './dirty-check.guard';

const routes: Routes = [{path:'', component: LandingPageComponent},
                        {path:'app-login-screen', component: LoginScreenComponent},
                        {path:'app-signup-screen/:id', component: SignupScreenComponent, canDeactivate:[DirtyCheckGuard]},
                        {path:'app-project-list/:id/:type', component: ProjectListComponent},
                        {path:'app-password-reset-screen', component: PasswordResetScreenComponent},
                        {path:'app-user-management-screen/:id', component: UserManagementScreenComponent},
                        {path:'app-company-list-screen/:id', component: CompanyListScreenComponent},
                        {path:'app-project-details/:id/:userid', component: ProjectDetailsComponent, canDeactivate:[DirtyCheckGuard]},
                        {path:'app-project-content/:id/:uid/:hid', component: ProjectContentComponent},
                        {path:'app-artefact-details/:id/:contId/:projId/:userId', component: ArtefactDetailsComponent, canDeactivate:[DirtyCheckGuard]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
