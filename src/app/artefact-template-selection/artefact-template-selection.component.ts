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
  selector: 'app-artefact-template-selection',
  templateUrl: './artefact-template-selection.component.html',
  styleUrls: ['./artefact-template-selection.component.css']
})
export class ArtefactTemplateSelectionComponent implements OnInit {

  constructor(public logout : LogoutService, private location: Location,public artefactInfo: ArtefactInfo, private route : ActivatedRoute, private http: HttpClient, private router : Router, private notifierService: NotifierService) { }

  ngOnInit(): void {
  }

}
