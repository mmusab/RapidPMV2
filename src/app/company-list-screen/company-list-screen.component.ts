import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: '[app-company-list-screen]',
  templateUrl: './company-list-screen.component.html',
  styleUrls: ['./company-list-screen.component.css']
})
export class CompanyListScreenComponent implements OnInit {
  companies: any;
  companyHead: any;
  constructor(private http: HttpClient, private router : Router) { }

  ngOnInit(){
    this.http.get('http://82.69.10,205:5002/getCompanies').subscribe((response)=>{
      this.companies = response as JSON
      this.companyHead = Object.keys(this.companies[0]);
      console.log(this.companyHead)
      console.log(this.companies)
    });
  }

  addCompany(){
    this.router.navigate(['/app-signup-screen', "id"]);
    console.log("in addcompany")
  }

}
