import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { NotifierModule } from 'angular-notifier';
import { CustomerInfo } from './customer-info';
import { CompanyInfo } from './company-info';
// import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { SignupScreenComponent } from './signup-screen/signup-screen.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { PasswordResetScreenComponent } from './password-reset-screen/password-reset-screen.component';
import { UserManagementScreenComponent } from './user-management-screen/user-management-screen.component';
import { DataService } from './data-service';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    SignupScreenComponent,
    ProjectListComponent,
    PasswordResetScreenComponent,
    UserManagementScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotifierModule
  ],
  providers: [CustomerInfo,CompanyInfo, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
