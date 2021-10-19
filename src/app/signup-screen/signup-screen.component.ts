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
  // signupCompIdNumber: number | undefined;
  customerId = ""
  sub: any;
  temp:any;
  temp2!: string[];
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.signupCompId = params['id'];
      if(this.signupCompId != ""){
        // this.signupCompIdNumber = +this.signupCompId;
        // this.signupCompIdNumber = this.signupCompIdNumber + 1;
        // this.signupCompId = String(this.signupCompIdNumber);
        console.log("id is not empty")
        this.http.get('http://82.69.10.205:5002/getAdmin/' + this.signupCompId).subscribe((response)=>{
        this.temp = response as JSON;
        console.log(this.temp[0])
        this.customerInfo.cust["company_id"] = this.temp[0]["company_id"];
        this.customerInfo.cust["customer_id"] = this.temp[0]["customer_id"];
        this.customerInfo.cust["name"] = this.temp[0]["name"];
        this.customerInfo.cust["email"] = this.temp[0]["email"];
        this.customerInfo.cust["password"] = this.temp[0]["password"];
        this.customerInfo.cust["company_role"] = this.temp[0]["company_role"];
        this.customerInfo.cust["status"] = this.temp[0]["status"];
        this.customerInfo.cust["verified"] = this.temp[0]["verified"];
        // this.temp2 = Object.keys(this.temp[0]);
        // for (let k of this.temp2){
        //   this.customerInfo.cust[k] = this.temp[0][k]
        // }
      });
      this.http.get('http://82.69.10.205:5002/getCompany/' + this.signupCompId).subscribe((response)=>{
        this.temp = response as JSON;
        console.log(this.temp[0])
        this.companyInfo.comp["company_id"] = this.temp[0]["company_id"];
        this.companyInfo.comp["name"] = this.temp[0]["name"];
        this.companyInfo.comp["address_line1"] = this.temp[0]["address_line1"];
        this.companyInfo.comp["address_line2"] = this.temp[0]["address_line2"];
        this.companyInfo.comp["address_line3"] = this.temp[0]["address_line3"];
        this.companyInfo.comp["city"] = this.temp[0]["city"];
        this.companyInfo.comp["country"] = this.temp[0]["country"];
        this.companyInfo.comp["postal_code"] = this.temp[0]["postal_code"];
        this.companyInfo.comp["RPM"] = this.temp[0]["RPM"];
        // this.temp2 = Object.keys(this.temp[0]);
        // for (let k of this.temp2){
        //   this.customerInfo.cust[k] = this.temp[0][k]
        // }
      });
      }
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
    this.http.post('http://82.69.10.205:5002/company', this.companyInfo.comp).subscribe((response)=>{
      this.signupCompId = (response as any)['message'];
      // this.dataService.adminId = this.signupCompId;
      this.customerInfo.cust["company_id"] = this.signupCompId;
      this.customerInfo.cust["company_role"] = "Admin";
      this.http.post('http://82.69.10.205:5002/customer', this.customerInfo.cust).subscribe((response)=>{
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
  goToProjects(){
    if(this.signupCompId != "" && this.signupCompId !="id"){
      this.router.navigate(['/app-project-list', this.customerInfo.cust["customer_id"], 'Admin']);
    }
    else{
      this.notifierService.notify('error', 'Please login to continue');
    }
  }
}
