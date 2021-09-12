import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CustomerInfo } from '../customer-info';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data-service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-user-management-screen',
  templateUrl: './user-management-screen.component.html',
  styleUrls: ['./user-management-screen.component.css']
})
export class UserManagementScreenComponent{
  customerId = "";
  signupCompId = "";
  sub: any;
  users:any;
  userHead :any;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.signupCompId = params['id'];
   });
   this.requestUsers();
    // this.users = this.requestUsers();
    // console.log(this.users)
  }
  constructor(public uCustomerInfo: CustomerInfo, private http: HttpClient, public dataService: DataService, private router : Router, private route : ActivatedRoute, private notifierService: NotifierService) { }

  onAddUser(){
    console.log(this.dataService.adminId);
    console.log(this.uCustomerInfo.cust);
    this.uCustomerInfo.cust["company_id"] = this.signupCompId;
    // this.customerInfo.cust["company_id"] = this.signupCustId;
    this.http.post('http://127.0.0.1:5002/customer', this.uCustomerInfo.cust).subscribe((response)=>{
      this.customerId = (response as any)['message'];
      // this.dataService.adminId = (response as any)['message'];
      this.notifierService.notify('success', 'New user has been created');
   });
  }
  goToSignUp(){
    this.router.navigate(['/app-signup-screen', this.signupCompId]);
  }

  requestUsers(){
    this.http.get('http://127.0.0.1:5002/getUsers/' + this.signupCompId).subscribe((response)=>{
      this.users = response as JSON
      this.userHead = Object.keys(this.users[0]);
      console.log(this.userHead)
    });
  }
  addRow(){
    console.log("i am in add row")

  }
  deleteRow(index: string | number){
    this.http.get('http://127.0.0.1:5002/deleteUser/' + this.users[index]['customer_id']).subscribe((response)=>{
      
    });
    console.log(this.users[index]['customer_id'])
  }
}

