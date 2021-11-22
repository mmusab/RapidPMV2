import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ArtefactInfo } from '../artefactinfo';
import { Location } from '@angular/common'

@Component({
  selector: 'app-artefact-details',
  templateUrl: './artefact-details.component.html',
  styleUrls: ['./artefact-details.component.css']
})
export class ArtefactDetailsComponent implements OnInit {
  projId = ""
  companyId = ""
  artefactId = ""
  containerId = ""
  userId = ""
  sub: any;
  temp:any;
  admins:any;
  users:any;

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
    // this.projId = params['id'];
    this.containerId = params['contId']
    this.projId = params['projId']
    this.userId = params['userId']
    this.http.get('http://82.69.10.205:5002/getProject/' + this.projId).subscribe((response)=>{
      this.temp = response as JSON;
      console.log(this.temp)
      this.companyId = this.temp[0]["company_id"];
      this.http.get('http://82.69.10.205:5002/getAdmin/' + this.companyId).subscribe((response)=>{
            this.admins = response as JSON;
            console.log(this.admins)
            // this.adminId = this.temp[0]["customer_id"];
            // this.router.navigate(['/app-project-list', this.adminId, "Admin"]);
        });
    });
    if(params['id'] != 'id'){
      this.artefactId = params['id']
      this.http.get('http://82.69.10.205:5002/getArtefact/' + this.artefactId).subscribe((response)=>{
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
  constructor(private location: Location,public artefactInfo: ArtefactInfo, private route : ActivatedRoute, private http: HttpClient, private router : Router, private notifierService: NotifierService) { }

  createUpdate(){
    this.artefactInfo.art["project_id"] = this.projId
    this.http.post('http://82.69.10.205:5002/artefact/' + this.containerId, this.artefactInfo.art).subscribe((response)=>{
      // this.projId = (response as any)['message'];
      // this.router.navigate(['/app-project-details', this.projId, this.userId]);
      this.router.navigate(['/app-project-content', this.projId, this.userId]);
      // this.notifierService.notify('success', 'project details updated');

  //     this.http.get('http://82.69.10.205:5002/getUser/' + this.projectInfo.proj["customer_id"]).subscribe((response)=>{
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
  back(){
    console.log('in back')
    this.location.back()
  }

}

