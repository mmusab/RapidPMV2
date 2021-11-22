import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserLogin } from '../user-login';
import { Location } from '@angular/common'

@Component({
  selector: '[app-login-screen]',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent{
  companyId = "";
  customerId = "";
  companyRole = "";
  incorrectPassCount = 0;
  errorMessage = "";
  forgotPasswordError = "";
  userEmail = UserLogin.userEmail;
  userPassword = UserLogin.userPassword;
  mess: Array<JSON> | undefined;
  g = "";

  // signupCompId = "";
  // sub: any;

  // ngOnInit() {
  //   this.sub = this.route.params.subscribe(params => {
  //     this.signupCompId = params['id'];
  //  });
  // }

  constructor(private location: Location, private httpClient: HttpClient, private router : Router, private route : ActivatedRoute,  private notifierService: NotifierService) { }

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
    this.httpClient.get('http://82.69.10.205:5002/login/' + this.userEmail + '/' + this.userPassword).toPromise().then(message => {
      console.log(message as JSON)
      this.errorMessage = (message as any)['message'];
      console.log(this.errorMessage);
      if(this.errorMessage == "Welcome"){
        UserLogin.userEmail = this.userEmail;
        UserLogin.userPassword = this.userPassword;
        this.customerId = (message as any)['id'];
        this.companyRole = (message as any)['role'];
        console.log(this.customerId);
        this.router.navigate(['/app-project-list', this.customerId[0], this.companyRole[0]]);
      }
      if(this.errorMessage == "Welcome RPM"){
        UserLogin.userEmail = this.userEmail;
        UserLogin.userPassword = this.userPassword;
        this.companyId = (message as any)['id'];
        this.companyRole = (message as any)['role'];
        console.log(this.companyId);
        this.router.navigate(['/app-company-list-screen', this.companyId[0]]);
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
    if(this.userEmail){url = 'http://82.69.10.205:5002/login/' + this.userEmail + '/none'}
    else{url = 'http://82.69.10.205:5002/login/none/none'}
    this.httpClient.get(url).toPromise().then(message => {
      console.log(message as JSON)
      this.errorMessage = (message as any)['message'];
      if(this.errorMessage == "Email address not found" || this.userEmail == ""){
        this.router.navigate(['/app-signup-screen', "id"]);
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
      if(this.userEmail){url = 'http://82.69.10.205:5002/login/' + this.userEmail + '/none'}
      else{url = 'http://82.69.10.205:5002/login/none/none'}
      this.httpClient.get(url).toPromise().then(message => {
        console.log(message as JSON)
        this.errorMessage = (message as any)['message'];
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
  back(){
    console.log('in back')
    this.location.back()
  }
}
