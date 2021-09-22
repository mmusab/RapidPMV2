import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: '[app-company-list-screen]',
  templateUrl: './company-list-screen.component.html',
  styleUrls: ['./company-list-screen.component.css']
})
export class CompanyListScreenComponent implements OnInit {
  companies: any;
  companyHead: any;
  sub: any;
  companyId = "";
  constructor(private http: HttpClient, private router : Router, private route : ActivatedRoute) { }

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      this.companyId = params['id'];
   });
    this.http.get('http://127.0.0.1:5002/getCompanies').subscribe((response)=>{
      this.companies = response as JSON
      this.companyHead = Object.keys(this.companies[0]);
      console.log(this.companyHead)
      console.log(this.companies)
      console.log(this.companyId)
    });
  }

  addCompany(){
    this.router.navigate(['/app-signup-screen', "id"]);
    console.log("in addcompany")
  }

  updateCompany(){
    this.router.navigate(['/app-signup-screen', this.companyId]);
    console.log("in companyDetail")
  }

}
