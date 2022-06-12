import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ArtefactInfo } from '../artefactinfo';
import { formatDate, Location } from '@angular/common'
import { LogoutService } from '../logout.service';
import jwt_decode from "jwt-decode";
import { ComponentCanDeactivate } from '../component-can-deactivate';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';


@Component({
  selector: 'app-artefact-details',
  templateUrl: './artefact-details.component.html',
  styleUrls: ['./artefact-details.component.css']
})
export class ArtefactDetailsComponent implements OnInit, ComponentCanDeactivate{
  // typeArtefact = {
  //   "type_id" : "",	
  //   "project_id" : "",
  //   "artefact_type" : "",
  //   "location_url" : "asfdaefresfw",
  //   "template_url" : "",
  //   "multiples" : "",
  //   "mandatory" : ""
  // };
  defaultTemplateLocation = ""
  defaultArtefactLocation = ""
  isChecked = false
  templateFlag = true
  typeArtefact = 0;
  date:any;
  ProjectName = ""
  companyName = ""
  projId = ""
  companyId = ""
  artefactId = ""
  containerId = ""
  userId = ""
  sub: any;
  temp:any;
  admins:any;
  artTypes:any;
  users:any;
  userEmail = "";
  userPassword = "";
  usr:any;
  isDirty = false;
  type = "";
  status = ['Proposed', 'In progress', 'Awaiting signoff', 'Complete']
  regex  = /^([a-zA-Z0-9\s\._-]+)$/
  myfile: any;
  artefactLocation = ["RPM database", "User defined default locations"]
  locationType = "RPM database"

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
      this.requestTypes();
      this.http.get('http://82.69.10.205:5002/getProject/' + this.projId).subscribe((response)=>{
        this.temp = response as JSON;
        console.log(this.temp)
        this.companyId = this.temp[0]["company_id"];
        this.ProjectName = this.temp[0]["project_name"];
        this.http.get('http://82.69.10.205:5002/getAdmin/' + this.companyId).subscribe((response)=>{
              this.admins = response as JSON;
              console.log(this.admins)
              // this.adminId = this.temp[0]["customer_id"];
              // this.router.navigate(['/app-project-list', this.adminId, "Admin"]);
          });
        this.http.get('http://82.69.10.205:5002/getCompany/' + this.companyId).subscribe((response)=>{
            this.temp = response as JSON;
            this.companyName = this.temp[0]["company_name"];
            this.companyId = this.temp[0]["company_id"];
            this.defaultTemplateLocation = "./" + this.companyId + '/' + this.projId + '/' + 'templates/'
            this.defaultArtefactLocation = "./" + this.companyId + '/' + this.projId + '/' + 'artefacts/'
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
        this.artefactInfo.art["artefact_id"] = this.temp[0]["artefact_id"];
        // this.templateFlag = false
        });
      }

      this.http.get('http://82.69.10.205:5002/getUser/' + this.userId).subscribe((response)=>{
        this.temp = response as JSON
        this.type = this.temp[0]["company_role"]
      });
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

  createUpdate(validty: boolean | null){
    console.log(this.templateFlag)
    console.log(this.isChecked)
    this.isDirty = false;
    if(validty && this.artefactInfo.art.artefact_name.match(this.regex)){
      console.log(this.artefactInfo.art)
      this.artefactInfo.art.artefact_type = this.artTypes[this.typeArtefact]['artefact_type']

      if(this.artefactInfo.art.create_date == ''){
        this.date=new Date().toLocaleDateString();;
        this.artefactInfo.art.create_date = this.date;
        this.artefactInfo.art.update_date = this.date;
      }
      else{
        this.date=new Date().toLocaleDateString();;
        this.artefactInfo.art.update_date = this.date;
      }
      if(this.templateFlag){
        if(this.locationType == "User defined default locations"){
          this.artefactInfo.art.template_url = this.artTypes[this.typeArtefact]['template_url']
          this.artefactInfo.art.location_url = this.artTypes[this.typeArtefact]['location_url']
        }
        else{

          this.artefactInfo.art.template_url = this.defaultTemplateLocation
          this.artefactInfo.art.location_url = this.defaultArtefactLocation

        }
      }
      else{
        this.artefactInfo.art.template_url = 'File uploaded, template ignored'
        if(this.locationType == "User defined default locations"){
          this.artefactInfo.art.location_url = this.artTypes[this.typeArtefact]['location_url']
        }
        else{
          this.artefactInfo.art.location_url = this.defaultArtefactLocation
        }
      }
      // this.artefactInfo.art.template_url = this.artefactInfo.art.template_url + '-' +this.files[0].relativePath
      let date1 = formatDate(this.artefactInfo.art.create_date,'MM-dd-yyy','en_US');
      let date2 = formatDate(this.artefactInfo.art.update_date,'MM-dd-yyy','en_US');
      if(true){
         
          // You could upload it like this:
          const formData = new FormData()
          if(this.myfile){
            formData.append('file', this.myfile)
          }
          else{
            formData.append('file', 'no file')
          }
          formData.append('artInfo', JSON.stringify(this.artefactInfo.art))
          
        this.artefactInfo.art["project_id"] = this.projId
        this.http.post('http://82.69.10.205:5002/artefact/' + this.containerId, formData).subscribe((response)=>{
          this.temp = response as JSON
          if(this.temp['message'] == 'success'){
            this.router.navigate(['/app-project-content', this.projId, this.userId, "id"]);
          }
          else{
            this.notifierService.notify('error', this.temp['message']);
          }
          // this.projId = (response as any)['message'];
          // this.router.navigate(['/app-project-details', this.projId, this.userId]);
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
      else{
        this.notifierService.notify('error', 'start date should be less than end date');
      }
    }
    else{
      if(this.artefactInfo.art.artefact_name.match(this.regex) || this.artefactInfo.art.artefact_name == ''){
        this.notifierService.notify('error', 'make sure you have filled all the fields');
      }
      else{
        this.notifierService.notify('error', 'name is not a valid filename');
      }
    }
  }
  back(){
    console.log('in back')
    this.location.back()
  }

  goToSignUp(){
    this.router.navigate(['/app-signup-screen', this.companyId]);
  }

  user(){
    if(this.type == "Admin"){
      this.router.navigate(['/app-user-management-screen', this.companyId]);
    }
    else{
      console.log(this.type)
      this.notifierService.notify('error', 'Can only be accessible by admin');
    }
  }

  goToProjects(){
    this.http.get('http://82.69.10.205:5002/getAdmin/' + this.companyId).subscribe((response)=>{
      this.temp = response as JSON;
      let adminId = this.temp[0]["user_id"];
      this.router.navigate(['/app-project-list', adminId, "Admin"]);
    });
  }
  // inValidForm(){
  //   this.notifierService.notify('error', 'make sure you have filled all the fields');
  // }
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //     // if (!this.canDeactivate()) {
  //         $event.returnValue =true;
  //     // }
  // }

  requestTypes(){
    this.http.get('http://82.69.10.205:5002/getArtefactDefaults/' + this.projId).subscribe((response)=>{
      this.artTypes = response as JSON
      // this.artefactInfo.art.template_url = this.artTypes[0]['template_url']
      console.log(this.artTypes)
    });
  }


  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    console.log('in dropped funtion')
    this.files = files;
    this.artefactInfo.art.template_url = this.artefactInfo.art.template_url + this.files[0].relativePath
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.myfile = file
          this.artefactInfo.art.template_url = 'File uploaded, template ignored'
          this.templateFlag = false
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any){
    console.log('file over')
    console.log(event);
  }

  public fileLeave(event: any){
    console.log('file leave')
    console.log(event);
  }
  getDrfaultUrls(){
    this.isChecked = !this.isChecked
    console.log(this.isChecked)
  }

  selectTemplate(){
    console.log("in select template")
    this.router.navigate(['/app-artefact-template-selection', this.projId]);
  }


}

