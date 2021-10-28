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
      // map = {"project":0,"container":1,"artefact":2}
  
      constructor(private http: HttpClient, private route : ActivatedRoute) {
       }
  
      ngOnInit() {
          this.sub = this.route.params.subscribe(params => {
          this.projectId = params['id'];
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
              { field: "Item", header: "Item" },
              { field: "project_id", header: "project_id" },
              { field: "ProjectType", header: "ProjectType" },
              { field: "ProjectTitle", header: "ProjectTitle" },
              { field: "ProjectDescription", header: "ProjectDescription" },
              { field: "ProjectStart", header: "ProjectStart" },
              { field: "ProjectEnd", header: "ProjectEnd" },
              { field: "customer_id", header: "customer_id" },
              { field: "CustomerEmail", header: "CustomerEmail" }
            ],
            [
              { field: "node", header: "node" },
              { field: "1", header: "1" },
              { field: "2", header: "2" },
              { field: "3", header: "3" },
              { field: "4", header: "4" },
              { field: "5", header: "5" },
              { field: "6", header: "6" },
              { field: "7", header: "7" },
              { field: "8", header: "8" }
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

}
