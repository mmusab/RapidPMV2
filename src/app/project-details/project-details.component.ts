import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ProjectInfo } from '../project-info';
import { Location } from '@angular/common'

@Component({
  selector: '[app-project-details]',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  projId = "";
  userId = ""
  sub: any;
  temp:any;
  admins:any;
  users:any;

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
    // this.projId = params['id'];
    if(params['id'] != 'id'){
      this.projId = params['id']
    }
    this.userId = params['userid'];
    // this.projectInfo.proj["company_id"] = this.userId;
    this.projectInfo.proj["template"] = 'N';
    this.http.get('http://82.69.10.205:5002/getUser/' + this.userId).subscribe((response)=>{
      this.users = response as JSON
      this.projectInfo.proj["company_id"] = this.users[0]["company_id"];
      console.log("companyID: " + this.projectInfo.proj["company_id"])
        this.http.get('http://82.69.10.205:5002/getAdmin/' + this.users[0]["company_id"]).subscribe((response)=>{
            this.admins = response as JSON;
            console.log(this.admins)
            // this.adminId = this.temp[0]["customer_id"];
            // this.router.navigate(['/app-project-list', this.adminId, "Admin"]);
        });
      });
    if(this.projId != ""){
      console.log("id is not empty")
      this.http.get('http://82.69.10.205:5002/getProject/' + this.projId).subscribe((response)=>{
      this.temp = response as JSON;
      console.log(this.temp)
      this.projectInfo.proj["project_id"] = this.temp[0]["project_id"];
      this.projectInfo.proj["company_id"] = this.temp[0]["company_id"];
      this.projectInfo.proj["project_name"] = this.temp[0]["project_name"];
      this.projectInfo.proj["template"] = this.temp[0]["template"];
      this.projectInfo.proj["status"] = this.temp[0]["status"];
      this.projectInfo.proj["owner"] = this.temp[0]["owner"];
      this.projectInfo.proj["start"] = this.temp[0]["start"];
      this.projectInfo.proj["end"] = this.temp[0]["end"];
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
  constructor(private location: Location, public projectInfo: ProjectInfo, private route : ActivatedRoute, private http: HttpClient, private router : Router, private notifierService: NotifierService) { }

  createUpdate(){
    this.http.post('http://82.69.10.205:5002/project', this.projectInfo.proj).subscribe((response)=>{
      this.projId = (response as any)['message'];
      // this.router.navigate(['/app-project-details', this.projId, this.userId]);
      this.router.navigate(['/app-project-list', this.userId, this.users[0]["company_role"]]);
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
