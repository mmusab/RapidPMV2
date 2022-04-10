import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CustomerInfo } from '../customer-info';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data-service';
import { NotifierService } from 'angular-notifier';
import { Location } from '@angular/common'
import { LogoutService } from '../logout.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-artefact-type-default',
  templateUrl: './artefact-type-default.component.html',
  styleUrls: ['./artefact-type-default.component.css']
})
export class ArtefactTypeDefaultComponent{
  typeId = "";
  adminId = "";
  projectId = "";
  temp:any;
  sub: any;
  // users:any;
  typeHead :any;
  typeDefaults :any;
  companyName = "";
  artDefault =
    {
      "type_id" : "",
      "project_id" : "",
      "artefact_type" : "-",
      "location_url" : "-",
      "template_url" : "-",
      "multiples" : "-",
      "mandatory" : "-"
    };
  userEmail = "";
  userPassword = "";
  usr:any;

  ngOnInit() {
    let token = localStorage.getItem('token');
    if (token) {
      console.log("token exists")
      this.usr = jwt_decode(token);
      this.userEmail = this.usr['email']
      this.userPassword = this.usr['password']
      // this.onLogin()
    }
    else{
      this.logout.logout()
    }
    this.sub = this.route.params.subscribe(params => {
      this.projectId = params['id'];
   });
  //  this.http.get('http://82.69.10.205:5002/getArtefactDefault/' + this.projectId).subscribe((response)=>{
  //     this.typeDefaults = response as JSON
  //     this.companyName = this.company[0]["company_name"]
  //     console.log(this.companyName)
  //   });
   this.requestTypes();
    // this.users = this.requestUsers();
    // console.log(this.users)
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }
  }
  constructor(public logout : LogoutService, private location: Location, public uCustomerInfo: CustomerInfo, private http: HttpClient, public dataService: DataService, private router : Router, private route : ActivatedRoute, private notifierService: NotifierService) { }

  onAddType(index: string | number){
    // console.log(this.dataService.adminId);
    // console.log(this.uCustomerInfo.cust);
    // this.uCustomerInfo.cust["company_id"] = this.signupCompId;
    // this.users[index]["company_id"] = this.signupCompId;
    this.typeDefaults[index]["project_id"] = this.projectId;
    console.log(this.typeDefaults[index])
    this.http.post('http://82.69.10.205:5002/type', this.typeDefaults[index]).subscribe((response)=>{
      console.log(response)
      this.typeId = (response as any)['message'];
      this.notifierService.notify('success', 'Type has been created/updated');
   });
  //  location.reload();
  }
  // goToSignUp(){
  //   this.router.navigate(['/app-signup-screen', this.signupCompId]);
  // }

  requestTypes(){
    this.http.get('http://82.69.10.205:5002/getArtefactDefaults/' + this.projectId).subscribe((response)=>{
      this.typeDefaults = response as JSON
      this.typeHead = Object.keys(this.artDefault);
      // if (!this.typeHead){
      //   this.typeDefaults = this.artDefault
      //   console.log(this.artDefault)
      //   // console.log(this.typeHead)
      //   // console.log(this.typeDefaults)
      // }
      
    });
  }
  deleteRow(index: string | number){
    console.log(this.typeDefaults[index])
    if(this.typeDefaults[index]['type_id']){
      this.http.get('http://82.69.10.205:5002/deleteType/' + this.typeDefaults[index]['type_id']).subscribe((response)=>{
        console.log(response)
        location.reload();
    });
    }
    // location.reload();
  }
  editField = "";

    updateList(id: number, property: string, event: any) {
      console.log(event.target.textContent)
      this.typeDefaults[id][property] = event.target.textContent;
      // console.log(this.users[id])
    }
    updateOptions(id: number, property: string, event: any) {
      console.log(event.target.value)
      this.typeDefaults[id][property] = event.target.value;
      // console.log(this.users[id])
    }

    remove(id: any) {
    }

    add() {
      this.typeDefaults.push(Object.assign({}, this.artDefault))
      console.log(this.typeDefaults)
    }

    // goToProjects(){
    //   this.http.get('http://82.69.10.205:5002/getAdmin/' + this.signupCompId).subscribe((response)=>{
    //     this.temp = response as JSON;
    //     this.adminId = this.temp[0]["user_id"];
    //     this.router.navigate(['/app-project-list', this.adminId, "Admin"]);
    //   });
    // }

    back(){
      console.log('in back')
      this.location.back()
    }

    locationUrl(event: any, index: string | number){
      console.log(event)
      this.typeDefaults[index]["location_url"] = event.target.value;
    }
    templateUrl(event: any, index: string | number){
      this.typeDefaults[index]["template_url"] = event.target.result;
    }
}