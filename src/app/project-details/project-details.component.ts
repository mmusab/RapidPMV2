import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ProjectInfo } from '../project-info';

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
    this.projectInfo.proj["customer_id"] = this.userId;
    this.projectInfo.proj["Template"] = 'N';
    this.http.get('http://82.69.10.205:5002/getUser/' + this.projectInfo.proj["customer_id"]).subscribe((response)=>{
      this.users = response as JSON
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
      this.projectInfo.proj["customer_id"] = this.temp[0]["customer_id"];
      this.projectInfo.proj["ProjectTitle"] = this.temp[0]["ProjectTitle"];
      this.projectInfo.proj["Template"] = this.temp[0]["Template"];
      this.projectInfo.proj["Status"] = this.temp[0]["Status"];
      this.projectInfo.proj["Owner"] = this.temp[0]["Owner"];
      this.projectInfo.proj["ProjectStart"] = this.temp[0]["ProjectStart"];
      this.projectInfo.proj["ProjectEnd"] = this.temp[0]["ProjectEnd"];
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
  constructor(public projectInfo: ProjectInfo, private route : ActivatedRoute, private http: HttpClient, private router : Router, private notifierService: NotifierService) { }

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

}
