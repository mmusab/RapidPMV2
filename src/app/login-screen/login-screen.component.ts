import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserLogin } from '../user-login';
import { Location } from '@angular/common'
import { AuthServiceService } from '../auth-service.service';
import jwt_decode from "jwt-decode";

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
  authorized:any
  usr:any

  // signupCompId = "";
  // sub: any;

  // ngOnInit() {
  //   this.sub = this.route.params.subscribe(params => {
  //     this.signupCompId = params['id'];
  //  });
  // }

  constructor(public auth: AuthServiceService, private location: Location, private httpClient: HttpClient, private router : Router, private route : ActivatedRoute,  private notifierService: NotifierService) { }

  ngOnInit(){
    let token = localStorage.getItem('token');
    if (token) {
      console.log("token exists")
      this.usr = jwt_decode(token);
      this.userEmail = this.usr['email']
      this.userPassword = this.usr['password']
      this.onLogin()
    }
  }
  
  resetErrors(){
    this.errorMessage = "";
    this.forgotPasswordError = "";
    this.userEmail = "";
    this.userPassword = "";
  }
  async onLogin(){
    await this.auth.login({'userEmail':this.userEmail, 'userPassword':this.userPassword})
    this.rerouting()
  }
  rerouting(){
    console.log(this.incorrectPassCount)
    // this.resetErrors();
    // await this.auth.login({'userEmail':this.userEmail, 'userPassword':this.userPassword})
    console.log(this.auth.currentUser)
    console.log(this.auth.currentUser.authorized)
    // console.log(this.authorized)
    // console.log(this.authorized['ZoneAwarePromise'])
    if(this.userEmail == ""){
    }
    if(this.auth.currentUser.authorized == "True"){
      console.log("is authorized")
      // this.httpClient.get('http://192.168.18.81:5002/login/' + this.userEmail + '/' + this.userPassword).toPromise().then(message => {
      //   console.log(message as JSON)
      //   this.errorMessage = (message as any)['message'];
      //   console.log(this.errorMessage);
        if(this.auth.currentUser.RPM == "False"){
          // this.auth.currentUser.userEmail = this.userEmail;
          // this.auth.currentUser.userPassword = this.userPassword;
          // this.customerId = (message as any)['id'];
          // this.companyRole = (message as any)['role'];
          // console.log(this.customerId);
          this.router.navigate(['/app-project-list', this.auth.currentUser.id, this.auth.currentUser.role]);
        }
        if(this.auth.currentUser.RPM == "True"){
          // this.auth.userEmail = this.userEmail;
          // this.auth.userPassword = this.userPassword;
          // this.companyId = (message as any)['id'];
          // this.companyRole = (message as any)['role'];
          // console.log(this.companyId);
          this.router.navigate(['/app-company-list-screen', this.auth.currentUser.id]);
        }
        }
        else{
          if(this.auth.currentUser.message == "Incorrect password"){
            this.errorMessage = "Incorrect password"
            this.incorrectPassCount += 1;
            if(this.incorrectPassCount > 2){
              this.errorMessage = "Incorrect password exceeded please reset"
              this.incorrectPassCount = 0;
            }
        }
      // });
    }
  }
  onregister(){
    // this.resetErrors();
    var url = "";
    if(this.userEmail){url = 'http://192.168.18.81:5002/login/' + this.userEmail + '/none'}
    else{url = 'http://192.168.18.81:5002/login/none/none'}
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
      if(this.userEmail){url = 'http://192.168.18.81:5002/login/' + this.userEmail + '/none'}
      else{url = 'http://192.168.18.81:5002/login/none/none'}
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
