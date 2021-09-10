import { Component, OnInit } from '@angular/core';
import { CustomerInfo } from '../customer-info';
import { CompanyInfo } from '../company-info';

@Component({
  selector: '[app-signup-screen]',
  templateUrl: './signup-screen.component.html',
  styleUrls: ['./signup-screen.component.css']
})
export class SignupScreenComponent{

  constructor(public customerInfo: CustomerInfo, public companyInfo: CompanyInfo) { }
  onSignup(){
    console.log(this.customerInfo.status)
    console.log(this.companyInfo.address_line1)
  }
}
