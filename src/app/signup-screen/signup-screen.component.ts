import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { CustomerInfo } from '../customer-info';
import { CompanyInfo } from '../company-info';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DataService } from '../data-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: '[app-signup-screen]',
  templateUrl: './signup-screen.component.html',
  styleUrls: ['./signup-screen.component.css']
})
export class SignupScreenComponent{
  signupCompId = ""
  customerId = ""
  sub: any;
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.signupCompId = params['id'];
   });
   if (!localStorage.getItem('foo')) {
    localStorage.setItem('foo', 'no reload')
    location.reload()
  } else {
    localStorage.removeItem('foo')
  }
  }
  constructor(public customerInfo: CustomerInfo, public companyInfo: CompanyInfo, private http: HttpClient, private router : Router, private route : ActivatedRoute, private notifierService: NotifierService, public dataService: DataService) { }
  onSignup(){
    this.http.post('http://82.69.10,205:5002/company', this.companyInfo.comp).subscribe((response)=>{
      this.signupCompId = (response as any)['message'];
      // this.dataService.adminId = this.signupCompId;
      this.customerInfo.cust["company_id"] = this.signupCompId;
      this.customerInfo.cust["company_role"] = "Admin";
      this.http.post('http://82.69.10,205:5002/customer', this.customerInfo.cust).subscribe((response)=>{
        this.customerId = (response as any)['message'];
   });
   this.router.navigate(['/app-signup-screen', this.signupCompId]);
   this.notifierService.notify('success', 'Company has been registered');
   this.notifierService.notify('success', 'Admin has been created');
   });
  }

  goToUsers(){
    console.log(this.signupCompId)
    if(this.signupCompId != "" && this.signupCompId !="id"){
      this.router.navigate(['/app-user-management-screen', this.signupCompId]);
    }
    else{
      this.notifierService.notify('error', 'Please login to continue');
    }
  }
}
