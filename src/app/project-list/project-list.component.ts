import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';
import {TreeNode} from 'primeng/api';

// interface FoodNode {
//   name: string;
//   children?: FoodNode[];
// }

// const hello: FoodNode[] = [
//   {
//     name: 'Fruit',
//     children: [
//       {name: 'Apple'},
//       {name: 'Banana'},
//       {name: 'Fruit loops'},
//     ]
//   }, {
//     name: 'Vegetables',
//     children: [
//       {
//         name: 'Green',
//         children: [
//           {name: 'Broccoli'},
//           {name: 'Brussels sprouts'},
//         ]
//       }, {
//         name: 'Orange',
//         children: [
//           {name: 'Pumpkins'},
//           {name: 'Carrots'},
//         ]
//       },
//     ]
//   },
// ];
  
// /** Flat node with expandable and level information */
// // interface ExampleFlatNode {
// //   expandable: boolean;
// //   name: string;
// //   level: number;
// // }

// @Component({
//   selector: '[app-project-list]',
//   templateUrl: './project-list.component.html',
//   styleUrls: ['./project-list.component.css']
// })
// export class ProjectListComponent{
//   treeControl = new NestedTreeControl<FoodNode>(node => node.children);
//   dataSource = new MatTreeNestedDataSource<FoodNode>();
//   TREE_DATA:any;

//   ngOnInit() {
//    this.http.get('http://127.0.0.1:5002/getProjectsTree/1').subscribe((response)=>{
//       console.log(response as JSON)
//       let temp = response as JSON;
//       this.TREE_DATA = response as FoodNode[];
//       // this.dataSource = new MatTreeNestedDataSource();
//       // this.dataSource.connect = response as JSON
//       console.log(this.TREE_DATA)
//       console.log(hello)
//       this.dataSource.data = this.TREE_DATA;
//     });
//   }
//   constructor(private http: HttpClient) { 
//     this.dataSource.data = this.TREE_DATA;
//   }


//   hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
//   // hasChild(){
//   //   return true
//   // }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: '[app-project-list]',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent{
    files: TreeNode[] = []
    cols: any[] = []
    map = {"project":0,"stage":1,"artifact":2}

    constructor(private http: HttpClient) {
     }

    ngOnInit() {
        // this.nodeService.getFilesystem().then(files => this.files = files);
        this.http.get('http://127.0.0.1:5002/getProjectsTree/1').subscribe((response)=>{
        console.log(response as JSON)
        let temp = response as JSON;
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