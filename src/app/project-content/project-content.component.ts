import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {TreeNode} from 'primeng/api';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common'
import { LogoutService } from '../logout.service';
import jwt_decode from "jwt-decode";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-project-content',
  templateUrl: './project-content.component.html',
  styleUrls: ['./project-content.component.css']
})
export class ProjectContentComponent implements OnInit {
      files: TreeNode[] = []
      cols: any[] = []
      sub: any;
      projectId = ""
      userId = ""
      shId = ""
      projectName = ""
      companyName = ""
      projectDefaultHeirarchy = ""
      selectedHeirarchy = ""
      selectedHeirarchyId = ""
      heirarchyList:any
      temp:any;
      containerList: any[] = []
      child = "child";
      parent = "parent";
      changeText=true;
      closeResult = '';
      newContainerName = ""
      root = "root"
      userEmail = "";
      userPassword = "";
      usr:any;
      editContainerName = ""
      newHeirarchyName = ""
      search = ""
      users:any;
      type = "";
      companyId = "";
      // map = {"project":0,"container":1,"artefact":2}

      constructor(private notifierService: NotifierService, public logout : LogoutService, private location: Location, private router : Router, private http: HttpClient, private route : ActivatedRoute, private modalService: NgbModal) {
       }

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
          this.userId = params['uid'];
          this.shId = params['hid'];
          this.http.get('http://127.0.0.1:5002/getProject/' + this.projectId).subscribe((response)=>{
            this.temp = response as JSON
            this.projectName = this.temp[0]['project_name']
            this.projectDefaultHeirarchy = this.temp[0]['hierarchy_id_default']
            this.http.get('http://127.0.0.1:5002/getHeirarchyList').subscribe((response)=>{
              this.heirarchyList = response as JSON;
              for(let h of this.heirarchyList){
                // if(h['hierarchy_id'] == this.projectDefaultHeirarchy){
                //   this.projectDefaultHeirarchy = h['hierarchy_name']
                //   this.selectedHeirarchy = h['hierarchy_name']
                //   this.selectedHeirarchyId = h['hierarchy_id']
                //   console.log(this.selectedHeirarchy)
                //   console.log(this.selectedHeirarchyId)
                // }
                if(this.shId == "id"){
                  if(h['hierarchy_id'] == this.projectDefaultHeirarchy){
                    this.projectDefaultHeirarchy = h['hierarchy_name']
                    this.selectedHeirarchy = h['hierarchy_name']
                    this.selectedHeirarchyId = h['hierarchy_id']
                    console.log(this.selectedHeirarchy)
                    console.log(this.selectedHeirarchyId)
                  }
                }
                else{
                  if(h['hierarchy_id'] == this.shId){
                    // this.projectDefaultHeirarchy = h['hierarchy_name']
                    this.selectedHeirarchy = h['hierarchy_name']
                    this.selectedHeirarchyId = h['hierarchy_id']
                    console.log(this.selectedHeirarchy)
                    console.log(this.selectedHeirarchyId)
                  }
                }
              }
              this.http.get('http://127.0.0.1:5002/getContainers/' + this.selectedHeirarchyId + '/' + this.projectId).subscribe((response)=>{
                this.temp = response as JSON;
                this.containerList = []
                for(let c of this.temp){
                  this.containerList.push(c['container_id'] + "-" + c['container_title'])
                }
              });
              this.http.get('http://127.0.0.1:5002/getprojectTree/' + this.projectId + '/' + this.selectedHeirarchyId).subscribe((response)=>{
                this.files = response as TreeNode[];
                console.log(this.files)
              });
            });
            this.http.get('http://127.0.0.1:5002/getCompany/' + this.temp[0]["company_id"]).subscribe((response)=>{
              this.temp = response as JSON;
              this.companyName = this.temp[0]['company_name']
            });
          });
          this.http.get('http://127.0.0.1:5002/getUser/' + this.userId).subscribe((response)=>{
          this.users = response as JSON
          this.type = this.users[0]["company_role"]
          this.companyId = this.users[0]["company_id"];
          });
       });
          // this.nodeService.getFilesystem().then(files => this.files = files);
          // this.http.get('http://127.0.0.1:5002/getprojectTree/' + this.projectId + '/' + this.selectedHeirarchyId).subscribe((response)=>{
          // // console.log(response as JSON)
          // // let temp = response as JSON;
          // this.files = response as TreeNode[];
          // // this.dataSource = new MatTreeNestedDataSource();
          // // this.dataSource.connect = response as JSON
          // console.log(this.files)
          // // console.log(hello)
          // // this.dataSource.data = this.files;
          // });

          this.cols = [
            [
              // { field: "ID", header: "ID" },
              { field: "Project Item", header: "Project Item" },
              { field: " ", header: " " },
              { field: "ArtefactType", header: "ArtefactType" },
              { field: "Status", header: "Status" },
              { field: "Owner", header: "Owner" }
            ],
            [
              // { field: "id", header: "id" },
              { field: "node", header: "node" },
              { field: " ", header: " " },
              { field: "artefact_type", header: "artefact_type" },
              { field: "status", header: "status" },
              { field: "artefact_owner", header: "artefact_owner" }
            ],
            [
              { field: "node", header: "node" },
              { field: "stage_id", header: "stage_id" },
              { field: "StageName", header: "StageName" },
              { field: "StageDescription", header: "StageDescription" },
              { field: "Status", header: "Status" },
              { field: "StageStart", header: "StageStart" },
              { field: "StageEnd", header: "StageEnd" },
              { field: "project_id", header: "project_id" }
            ],
            [
              { field: "node", header: "node" },
              { field: "artifact_id", header: "artifact_id" },
              { field: "ArtefactName", header: "ArtefactName" },
              { field: "ArtefactProductType", header: "ArtefactProductType" },
              { field: "ArtefactStatus", header: "ArtefactStatus" },
              { field: "DateCreated", header: "DateCreated" },
              { field: "workPackage_id", header: "workPackage_id" },
              { field: "artefactType_id", header: "artefactType_id" },
              { field: "stage_id", header: "stage_id" }
            ]
          ];
      }
    move(pCont: string,cont: any){
      if(cont['id'] != pCont.split('-')[0]){
        if(cont['artefact_type'] == ""){
          this.http.get('http://127.0.0.1:5002/moveContainer/' + cont['id'] + "/container/" + pCont.split('-')[0] + "/" + this.selectedHeirarchyId).subscribe((response)=>{
          // location.reload()
          this.router.navigate(['/app-project-content', this.projectId, this.userId,this.selectedHeirarchyId]);
          location.reload()
        });
        }
        else{
          this.http.get('http://127.0.0.1:5002/moveContainer/' + cont['id'] + "/artefact/" + pCont.split('-')[0] + "/" + this.selectedHeirarchyId).subscribe((response)=>{
          // location.reload()
          this.router.navigate(['/app-project-content', this.projectId, this.userId,this.selectedHeirarchyId]);
          location.reload()
          });
        }
      }
      else{
        this.notifierService.notify('error', "container cannot be moved inside itself");
      }
    }
    copy(pCont: string,cont: any){
      if(cont['id'] != pCont.split('-')[0]){
        if(cont['artefact_type'] == ""){
          this.http.get('http://127.0.0.1:5002/copyContainer/' + cont['id'] + "/container/" + pCont.split('-')[0]).subscribe((response)=>{
          location.reload()
        });
        }
        else{
          this.http.get('http://127.0.0.1:5002/copyContainer/' + cont['id'] + "/artefact/" + pCont.split('-')[0]).subscribe((response)=>{
          location.reload()
          });
        }
      }
      else{
        this.notifierService.notify('error', "container cannot be copied inside itself");
      }
    }
    delete(cont: any){
      if(cont['artefact_type'] == ""){
        this.http.get('http://127.0.0.1:5002/deleteContainer/' + cont['id'] + "/container").subscribe((response)=>{
        let msg = (response as any)['message'];
        console.log(msg)
        if(msg != 'done'){
          this.notifierService.notify('error', 'record has children, only items without child records can be deleted');
        }
        else{
          location.reload()
        }
      });
      }
      else{
        this.http.get('http://127.0.0.1:5002/deleteContainer/' + cont['id'] + "/artefact").subscribe((response)=>{
        location.reload()
        });
      }
    }
    addArtefact(row:any){
      this.router.navigate(['/app-artefact-details', 'id', row, this.projectId, this.userId]);
    }
    editDetail(row: string | number){
      // this.router.navigate(['/app-artefact-details', row, row, this.projectId, this.userId]);
      return "/app-artefact-details/" + row + '/' + row + '/' + this.projectId + '/' + this.userId

    }
    openArtefact(row: string | number){
      console.log("inside open Artefact")
      this.http.get('http://127.0.0.1:5002/openArtefact/' + row + '/default').subscribe((response)=>{
        this.temp = response as JSON;
        this.notifierService.notify('error', this.temp['message']);
        // if(this.temp['message'] == 'make sure client is running'){
        //   this.notifierService.notify('error', this.temp['message']);
        // }
        // if(this.temp['message'] == 'make sure location urls are correct'){
        //   this.notifierService.notify('error', this.temp['message']);
        // }
        console.log(this.temp)
        });
    }
    // addContainer(pCont: string,cont:any){
      
    // }
    open(content:any, row:any) {
      console.log("in open content")
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        // console.log("new container name: " + this.newContainerName)
        // console.log("parent container id: ")
        // console.log(row)
        // console.log(this.selectedHeirarchyId)
        this.http.get('http://127.0.0.1:5002/addContainer/' + this.newContainerName + "/" + row + "/" + this.projectId + "/" + this.selectedHeirarchyId).subscribe((response)=>{
        location.reload()
      });
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    heirarchy(content:any) {
      console.log("in adding new heirarchy")
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log("new heirarchy name: " + this.newHeirarchyName)
        this.http.get('http://127.0.0.1:5002/addHeirarchy/' + this.newHeirarchyName).subscribe((response)=>{
          let id = (response as any)['message'];
          this.selectedHeirarchyId = id
          this.selectedHeirarchy = this.newHeirarchyName
          this.http.get('http://127.0.0.1:5002/getprojectTree/' + this.projectId + '/' + this.selectedHeirarchyId).subscribe((response)=>{
          this.files = []  
          this.files = response as TreeNode[];
          console.log(this.files)
          this.http.get('http://127.0.0.1:5002/getHeirarchyList').subscribe((response)=>{
              this.heirarchyList = response as JSON;
          });
          this.http.get('http://127.0.0.1:5002/getContainers/' + this.selectedHeirarchyId + '/' + this.projectId).subscribe((response)=>{
            this.temp = response as JSON;
            this.containerList = []
            for(let c of this.temp){
              this.containerList.push(c['container_id'] + "-" + c['container_title'])
            }
          });
        });
          // location.reload()
      });
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    editContainer(content:any, row:any) {
      console.log("in open content")
      this.http.get('http://127.0.0.1:5002/getContainer/' + row).subscribe((response)=>{
              this.temp = response as JSON;
              this.editContainerName = this.temp[0]['container_title']
            });
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log(row)
        console.log(this.newContainerName)
        if(this.newContainerName != ""){
          this.http.get('http://127.0.0.1:5002/updateContainer/' + this.newContainerName + "/" + row).subscribe((response)=>{
            this.newContainerName=""
            this.editContainerName=""
          location.reload()
        });
        this.newContainerName=""
        this.editContainerName=""
        }
        this.newContainerName=""
        this.editContainerName=""
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }

    back(){
      console.log('in back')
      this.location.back()
    }

    refreshList(){
      console.log("in refresh list")
      console.log(this.heirarchyList)
      console.log(this.selectedHeirarchy)
      this.selectedHeirarchyId = this.selectedHeirarchy

      this.router.navigate(['/app-project-content', this.projectId, this.userId,this.selectedHeirarchyId]);
      // location.reload()

      // this.http.get('http://127.0.0.1:5002/getprojectTree/' + this.projectId + '/' + this.selectedHeirarchyId).subscribe((response)=>{
      //   this.files = []  
      //   this.files = response as TreeNode[];
      //   console.log(this.files)
      // });
      // this.http.get('http://127.0.0.1:5002/getContainers/' + this.selectedHeirarchyId + '/' + this.projectId).subscribe((response)=>{
      //   this.temp = response as JSON;
      //   this.containerList = []
      //   for(let c of this.temp){
      //     this.containerList.push(c['container_id'] + "-" + c['container_title'])
      //   }
      // });


      // for(let h of this.heirarchyList){
      //   if(h['hierarchy_name'] == this.selectedHeirarchy){
      //     console.log("in if")
      //     this.selectedHeirarchyId = h['hierarchy_id']
      //     this.http.get('http://127.0.0.1:5002/getprojectTree/' + this.projectId + '/' + this.selectedHeirarchyId).subscribe((response)=>{
      //     this.files = []  
      //     this.files = response as TreeNode[];
      //       console.log(this.files)
      //     });
      //   }
      // }
    }

    // addHeirarchy(){
    //   this.http.get('http://127.0.0.1:5002/addHeirarchy').subscribe((response)=>{
    //     location.reload()
    //   });
    // }

      // abstract canDeactivate(): boolean;
    
    
    
        // @HostListener('window:beforeunload', ['$event'])
        // unloadNotification($event: any) {
        //     // if (!this.canDeactivate()) {
        //         $event.returnValue =true;
        //     // }
        // }
  searchFilter(){
    console.log(this.search)
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
    this.http.get('http://127.0.0.1:5002/getAdmin/' + this.companyId).subscribe((response)=>{
      this.temp = response as JSON;
      let adminId = this.temp[0]["user_id"];
      this.router.navigate(['/app-project-list', adminId, "Admin"]);
    });
  }
}
