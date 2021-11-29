import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import {MatSelectModule} from '@angular/material/select';
import {TreeTableModule} from 'primeng/treetable';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {ContextMenuModule} from 'primeng/contextmenu';
// import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NotifierModule } from 'angular-notifier';
import { CustomerInfo } from './customer-info';
import { CompanyInfo } from './company-info';
import { ProjectInfo } from './project-info';
import { ArtefactInfo } from './artefactinfo';
// import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { SignupScreenComponent } from './signup-screen/signup-screen.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { PasswordResetScreenComponent } from './password-reset-screen/password-reset-screen.component';
import { UserManagementScreenComponent } from './user-management-screen/user-management-screen.component';
import { DataService } from './data-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyListScreenComponent } from './company-list-screen/company-list-screen.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectContentComponent } from './project-content/project-content.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArtefactDetailsComponent } from './artefact-details/artefact-details.component';
import { AuthServiceService } from './auth-service.service';
import { LogoutService } from './logout.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    SignupScreenComponent,
    ProjectListComponent,
    PasswordResetScreenComponent,
    UserManagementScreenComponent,
    CompanyListScreenComponent,
    ProjectDetailsComponent,
    ProjectContentComponent,
    ArtefactDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotifierModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTreeModule,
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    InputTextModule,
    ToastModule,
    ContextMenuModule,
    TreeTableModule,
    MatSelectModule,
    NgbModule
  ],
  providers: [CustomerInfo,CompanyInfo, DataService, ProjectInfo,ArtefactInfo, AuthServiceService, LogoutService],
  bootstrap: [AppComponent]
})
export class AppModule { }
