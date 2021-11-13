import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {TreeNode} from 'primeng/api';

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
      projectName = ""
      companyName = ""
      projectDefaultHeirarchy = ""
      selectedHeirarchy = ""
      selectedHeirarchyId = ""
      heirarchyList:any
      temp:any;
      containerList: any[] = []
      // map = {"project":0,"container":1,"artefact":2}

      constructor(private http: HttpClient, private route : ActivatedRoute) {
       }

      ngOnInit() {
          this.sub = this.route.params.subscribe(params => {
          this.projectId = params['id'];
          this.userId = params['uid'];
          this.http.get('http://127.0.0.1:5002/getProject/' + this.projectId).subscribe((response)=>{
            this.temp = response as JSON
            this.projectName = this.temp[0]['project_name']
            this.projectDefaultHeirarchy = this.temp[0]['hierarchy_id_default']
            this.http.get('http://127.0.0.1:5002/getHeirarchyList').subscribe((response)=>{
              this.heirarchyList = response as JSON;
              for(let h of this.heirarchyList){
                if(h['hierarchy_id'] == this.projectDefaultHeirarchy){
                  this.projectDefaultHeirarchy = h['hierarchy_name']
                  this.selectedHeirarchy = h['hierarchy_name']
                  this.selectedHeirarchyId = h['hierarchy_id']
                }
              }
              this.http.get('http://127.0.0.1:5002/getContainers/' + this.selectedHeirarchyId).subscribe((response)=>{
                this.temp = response as JSON;
                for(let c of this.temp){
                  this.containerList.push(c['container_id'] + "-" + c['container_title'])
                }
              });
            });
            this.http.get('http://127.0.0.1:5002/getCompany/' + this.temp[0]["company_id"]).subscribe((response)=>{
              this.temp = response as JSON;
              this.companyName = this.temp[0]['company_name']
            });
          });
       });
          // this.nodeService.getFilesystem().then(files => this.files = files);
          this.http.get('http://127.0.0.1:5002/getprojectTree/' + this.projectId).subscribe((response)=>{
          // console.log(response as JSON)
          // let temp = response as JSON;
          this.files = response as TreeNode[];
          // this.dataSource = new MatTreeNestedDataSource();
          // this.dataSource.connect = response as JSON
          console.log(this.files)
          // console.log(hello)
          // this.dataSource.data = this.files;
          });

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
      if(cont['artefact_type'] == ""){
        this.http.get('http://127.0.0.1:5002/moveContainer/' + cont['id'] + "/container/" + pCont.split('-')[0]).subscribe((response)=>{
        location.reload()
      });
      }
      else{
        this.http.get('http://127.0.0.1:5002/moveContainer/' + cont['id'] + "/artefact/" + pCont.split('-')[0]).subscribe((response)=>{
        location.reload()
        });
      }
    }
    copy(pCont: string,cont: any){
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
    delete(cont: any){
      this.http.get('http://127.0.0.1:5002/deleteContainer/' + cont['id'] + "/artefact").subscribe((response)=>{
        location.reload()
      });
    }
}
