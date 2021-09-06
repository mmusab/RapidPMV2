import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: '[app-login-screen]',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent{
  incorrectPassCount = 0;
  errorMessage = "";
  forgotPasswordError = "";
  userEmail = "";
  userPassword = "";
  mess: Array<JSON> | undefined;
  g = "";
  constructor(private httpClient: HttpClient, private router : Router, private notifierService: NotifierService) { }

  resetErrors(){
    this.errorMessage = "";
    this.forgotPasswordError = "";
    this.userEmail = "";
    this.userPassword = "";
  }
  onLogin(){
    // this.resetErrors();
    if(this.userEmail == ""){
    }
    this.httpClient.get('http://127.0.0.1:5002/login/' + this.userEmail + '/' + this.userPassword).toPromise().then(message => {
      this.errorMessage = (message as any)[0]['message'];
      if(this.errorMessage == "Welcome"){
        this.router.navigate(['/app-project-list']);
      }
      if(this.errorMessage == "Incorrect password"){
        this.incorrectPassCount += 1;
        if(this.incorrectPassCount > 2){
          this.errorMessage = "Incorrect password exceeded please reset"
        }
      }
      else{
        this.incorrectPassCount = 0;
      }
    });
  }
  onregister(){
    // this.resetErrors();
    var url = "";
    if(this.userEmail){url = 'http://127.0.0.1:5002/login/' + this.userEmail + '/none'}
    else{url = 'http://127.0.0.1:5002/login/none/none'}
    this.httpClient.get(url).toPromise().then(message => {
      this.errorMessage = (message as any)[0]['message'];
      if(this.errorMessage == "Email address not found" || this.userEmail == ""){
        this.router.navigate(['/app-signup-screen']);
      }
      else{
        this.errorMessage = "Email Already Exists"
      }
    });
  }
  forgotPassword(){
    // this.resetErrors();
    if(this.userEmail == ""){
      this.forgotPasswordError = "Please enter your email address"
    }
    else{
      this.forgotPasswordError = ""
      var url = "";
      if(this.userEmail){url = 'http://127.0.0.1:5002/login/' + this.userEmail + '/none'}
      else{url = 'http://127.0.0.1:5002/login/none/none'}
      this.httpClient.get(url).toPromise().then(message => {
        this.errorMessage = (message as any)[0]['message'];
        if(this.errorMessage == "Email address not found" || this.userEmail == ""){
          this.forgotPasswordError = "Email does not exist"
        }
        else{
          this.errorMessage = "";
          this.forgotPasswordError = "";
          this.notifierService.notify('success', 'Your password email has been sent');
        }
      });
    }
  }
}