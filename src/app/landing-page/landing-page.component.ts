import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { AuthServiceService } from '../auth-service.service';
import { Location } from '@angular/common'
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  closeResult = '';
  companyId = "";
  customerId = "";
  companyRole = "";
  incorrectPassCount = 0;
  errorMessage = "";
  forgotPasswordError = "";
  mess: Array<JSON> | undefined;
  g = "";
  authorized:any
  usr:any
  userEmail = "";
  userPassword = "";
  constructor(private modalService: NgbModal, public auth: AuthServiceService, private location: Location, private httpClient: HttpClient, private router : Router, private route : ActivatedRoute,  private notifierService: NotifierService) { }

  ngOnInit(): void {
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  login(content:any) {
    let token = localStorage.getItem('token');
    if (token) {
      console.log("token exists")
      this.usr = jwt_decode(token);
      this.userEmail = this.usr['email']
      this.userPassword = this.usr['password']
      this.onLogin()
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
      // this.httpClient.get('http://127.0.0.1:5002/login/' + this.userEmail + '/' + this.userPassword).toPromise().then(message => {
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
    if(this.userEmail){url = 'http://127.0.0.1:5002/login/' + this.userEmail + '/none'}
    else{url = 'http://127.0.0.1:5002/login/none/none'}
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
      if(this.userEmail){url = 'http://127.0.0.1:5002/login/' + this.userEmail + '/none'}
      else{url = 'http://127.0.0.1:5002/login/none/none'}
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
  // back(){
  //   console.log('in back')
  //   this.location.back()
  // }
}
