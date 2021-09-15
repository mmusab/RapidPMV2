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
  cust = 
    {
      "company_id": "",
      "company_role": "",
      "customer_id": "",
      "email": "",
      "name": "",
      "password": "",
      "status": "",
      "verified": "",    
    };

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.signupCompId = params['id'];
   });
   this.requestUsers();
    // this.users = this.requestUsers();
    // console.log(this.users)
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
  }
  constructor(public uCustomerInfo: CustomerInfo, private http: HttpClient, public dataService: DataService, private router : Router, private route : ActivatedRoute, private notifierService: NotifierService) { }

  onAddUser(index: string | number){
    console.log(this.dataService.adminId);
    console.log(this.uCustomerInfo.cust);
    this.uCustomerInfo.cust["company_id"] = this.signupCompId;
    this.http.post('http://127.0.0.1:5002/customer', this.uCustomerInfo.cust).subscribe((response)=>{
      this.customerId = (response as any)['message'];
      this.notifierService.notify('success', 'New user has been created');
   });
   location.reload();
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
  // deleteRow(index: string | number){
  //   this.http.get('http://127.0.0.1:5002/deleteUser/' + this.users[index]['customer_id']).subscribe((response)=>{
      
  //   });
  //   console.log(this.users[index]['customer_id'])
  //   location.reload();
  // }
  editField = "";

    awaitingPersonList: Array<any> = [
      ];

    updateList(id: number, property: string, event: any) {
      const editField = event.target.textContent;
      this.users[id][property] = editField;
      console.log(this.users[id])
    }

    remove(id: any) {
      this.awaitingPersonList.push(this.users[id]);
      this.users.splice(id, 1);
    }

    add() {
      this.users.push(this.cust)
    }

    changeValue(id: number, property: string, event: any) {
      this.editField = event.target.textContent;
    }
}

