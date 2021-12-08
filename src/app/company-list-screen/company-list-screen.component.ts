import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LogoutService } from '../logout.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: '[app-company-list-screen]',
  templateUrl: './company-list-screen.component.html',
  styleUrls: ['./company-list-screen.component.css']
})
export class CompanyListScreenComponent implements OnInit {
  companies: any;
  companyHead: any;
  sub: any;
  // user:any;
  companyId = "";
  userId = "";
  userEmail = "";
  userPassword = "";
  usr:any;
  constructor(private location: Location, private http: HttpClient, private router : Router, private route : ActivatedRoute, public logout : LogoutService) { }

  ngOnInit(){
    let token = localStorage.getItem('token');
    if (token) {
      console.log("token exists")
      this.usr = jwt_decode(token);
      this.userEmail = this.usr['email']
      this.userPassword = this.usr['password']
      this.companyId = this.usr['compId']
      // this.userId = this.usr['id']
      // this.onLogin()
    }
    else{
      console.log("logging out")
      this.logout.logout()
    }
  //   this.sub = this.route.params.subscribe(params => {
  //     this.companyId = params['id'];
  //  });
    this.http.get('http://127.0.0.1:5002/getCompanies').subscribe((response)=>{
      console.log("got companies")
      this.companies = response as JSON
      this.companyHead = Object.keys(this.companies[0]);
      console.log(this.companyHead)
      console.log(this.companies)
      console.log(this.companyId)
    });
    // this.http.get('http://127.0.0.1:5002/getUser/' + this.userId).subscribe((response)=>{
    //   this.user = response as JSON
    // });
  }

  addCompany(){
    console.log("in addcompany")
    this.router.navigate(['/app-signup-screen', "id"]);
  }

  updateCompany(index: string | number){
    console.log("in companyDetail")
    console.log("company id: " + this.companies[index]['company_id'])
    this.router.navigate(['/app-signup-screen', this.companies[index]['company_id']]);
  }

  back(){
    console.log('in back')
    this.location.back()
  }

}
