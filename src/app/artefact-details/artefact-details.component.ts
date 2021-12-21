import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ArtefactInfo } from '../artefactinfo';
import { formatDate, Location } from '@angular/common'
import { LogoutService } from '../logout.service';
import jwt_decode from "jwt-decode";
import { ComponentCanDeactivate } from '../component-can-deactivate';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-artefact-details',
  templateUrl: './artefact-details.component.html',
  styleUrls: ['./artefact-details.component.css']
})
export class ArtefactDetailsComponent implements OnInit, ComponentCanDeactivate{
  projId = ""
  companyId = ""
  artefactId = ""
  containerId = ""
  userId = ""
  sub: any;
  temp:any;
  admins:any;
  users:any;
  userEmail = "";
  userPassword = "";
  usr:any;
  isDirty = false;

  ngOnInit(){
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
    // this.projId = params['id'];
    this.containerId = params['contId']
    this.projId = params['projId']
    this.userId = params['userId']
    this.http.get('http://127.0.0.1:5002/getProject/' + this.projId).subscribe((response)=>{
      this.temp = response as JSON;
      console.log(this.temp)
      this.companyId = this.temp[0]["company_id"];
      this.http.get('http://127.0.0.1:5002/getAdmin/' + this.companyId).subscribe((response)=>{
            this.admins = response as JSON;
            console.log(this.admins)
            // this.adminId = this.temp[0]["customer_id"];
            // this.router.navigate(['/app-project-list', this.adminId, "Admin"]);
        });
    });
    if(params['id'] != 'id'){
      this.artefactId = params['id']
      this.http.get('http://127.0.0.1:5002/getArtefact/' + this.artefactId).subscribe((response)=>{
      this.temp = response as JSON
      console.log(response as JSON)
      this.artefactInfo.art["artefact_type"] = this.temp[0]["artefact_type"];
      this.artefactInfo.art["artefact_owner"] = this.temp[0]["artefact_owner"];
      this.artefactInfo.art["artefact_name"] = this.temp[0]["artefact_name"];
      this.artefactInfo.art["description"] = this.temp[0]["description"];
      this.artefactInfo.art["status"] = this.temp[0]["status"];
      this.artefactInfo.art["create_date"] = this.temp[0]["create_date"];
      this.artefactInfo.art["update_date"] = this.temp[0]["update_date"];
      this.artefactInfo.art["location_url"] = this.temp[0]["location_url"];
      this.artefactInfo.art["template_url"] = this.temp[0]["template_url"];
      this.artefactInfo.art["project_id"] = this.temp[0]["project_id"];
      this.artefactInfo.art["template"] = this.temp[0]["template"];
      this.artefactInfo.art["artefact_id"] = this.temp[0]["artefact_id"];
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
  constructor(public logout : LogoutService, private location: Location,public artefactInfo: ArtefactInfo, private route : ActivatedRoute, private http: HttpClient, private router : Router, private notifierService: NotifierService) { }
  canDeactivate(): boolean{
    return !this.isDirty;
  }

  createUpdate(){
    let date1 = formatDate(this.artefactInfo.art.create_date,'MM-dd-yyy','en_US');
    let date2 = formatDate(this.artefactInfo.art.update_date,'MM-dd-yyy','en_US');
    if(date1 < date2){
      this.artefactInfo.art["project_id"] = this.projId
      this.http.post('http://127.0.0.1:5002/artefact/' + this.containerId, this.artefactInfo.art).subscribe((response)=>{
        // this.projId = (response as any)['message'];
        // this.router.navigate(['/app-project-details', this.projId, this.userId]);
        this.router.navigate(['/app-project-content', this.projId, this.userId]);
        // this.notifierService.notify('success', 'project details updated');
  
    //     this.http.get('http://127.0.0.1:5002/getUser/' + this.projectInfo.proj["customer_id"]).subscribe((response)=>{
    //     this.temp = response as JSON
    //     console.log(this.temp[0]["company_id"])
    //     console.log(this.temp[0]["company_role"])
    //     this.router.navigate(['/app-project-details', this.projId]);
    //     this.router.navigate(['/app-project-list', this.userId, this.temp[0]["company_role"]]);
    //     this.router.navigate(['/app-project-details', this.projId, this.userId]);
    //     this.notifierService.notify('success', 'project details updated');
    //  });
     });
    }
    else{
      this.notifierService.notify('error', 'start date should be less than end date');
    }
  }
  back(){
    console.log('in back')
    this.location.back()
  }
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //     // if (!this.canDeactivate()) {
  //         $event.returnValue =true;
  //     // }
  // }

}

