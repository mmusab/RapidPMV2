import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CustomerInfo } from '../customer-info';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data-service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: '[app-user-management-screen]',
  templateUrl: './user-management-screen.component.html',
  styleUrls: ['./user-management-screen.component.css']
})
export class UserManagementScreenComponent{
  customerId = "";
  adminId = "";
  signupCompId = "";
  temp:any;
  sub: any;
  users:any;
  userHead :any;
  company :any;
  companyName = "";
  cust =
    {
      "company_id": "",
      "company_role": "user",
      "customer_id": "",
      "email": "-",
      "name": "-",
      "password": "-",
      "status": "-",
      "verified": "Yes",
    };

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.signupCompId = params['id'];
   });
   this.http.get('http://127.0.0.1:5002/getCompany/' + this.signupCompId).subscribe((response)=>{
      this.company = response as JSON
      this.companyName = this.company[0]["name"]
      console.log(this.companyName)
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
    // console.log(this.dataService.adminId);
    // console.log(this.uCustomerInfo.cust);
    this.uCustomerInfo.cust["company_id"] = this.signupCompId;
    this.users[index]["company_id"] = this.signupCompId;
    this.http.post('http://127.0.0.1:5002/customer', this.users[index]).subscribe((response)=>{
      console.log(response)
      this.customerId = (response as any)['message'];
      this.notifierService.notify('success', 'New user has been created/updated');
   });
  //  location.reload();
  }
  goToSignUp(){
    this.router.navigate(['/app-signup-screen', this.signupCompId]);
  }

  requestUsers(){
    this.http.get('http://127.0.0.1:5002/getUsers/' + this.signupCompId).subscribe((response)=>{
      this.users = response as JSON
      this.userHead = Object.keys(this.users[0]);
      console.log(this.userHead)
      console.log(this.users)
    });
  }
  deleteRow(index: string | number){
    if(this.users[index]['customer_id']){
      this.http.get('http://127.0.0.1:5002/deleteUser/' + this.users[index]['customer_id']).subscribe((response)=>{
        console.log(response)
    });
    }
    // location.reload();
  }
  editField = "";

    updateList(id: number, property: string, event: any) {
      const editField = event.target.textContent;
      this.users[id][property] = editField;
      // console.log(this.users[id])
    }

    remove(id: any) {
    }

    add() {
      this.users.push(Object.assign({}, this.cust))
      console.log(this.users)
    }

    goToProjects(){
      this.http.get('http://127.0.0.1:5002/getAdmin/' + this.signupCompId).subscribe((response)=>{
        this.temp = response as JSON;
        this.adminId = this.temp[0]["customer_id"];
        this.router.navigate(['/app-project-list', this.adminId, "Admin"]);
      });
    }

    // changeValue(id: number, property: string, event: any) {
    //   this.editField = event.target.textContent;
    // }
}

