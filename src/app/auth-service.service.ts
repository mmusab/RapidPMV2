import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { JwtHelper } from 'angular2-jwt';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  currentUser = {
    'authorized':"",
    'message':"",
    'compId':"",
    'id':"",
    'role':"",
    "userEmail":"",
    "userPassword":"",
    "RPM":""
}
  constructor(private httpClient: HttpClient) {
    let token = localStorage.getItem('token');
    // if (token) {
    //   let jwt = new JwtHelper();
    //   this.currentUser = jwt.decodeToken(token);
    // }
  }

async login(credentials:any) {
  let token = localStorage.getItem('token');
  const message = await this.httpClient.get('http://192.168.18.81:5002/login/' + credentials['userEmail'] + '/' + credentials['userPassword']).toPromise()
  console.log(message);
  this.currentUser['authorized'] = (message as any)['authorized'];
  this.currentUser['message'] = (message as any)['message'][0];
  this.currentUser['compId'] = (message as any)['compId'][0];
  this.currentUser['id'] = (message as any)['id'][0];
  this.currentUser['role'] = (message as any)['role'][0];
  this.currentUser['RPM'] = (message as any)['RPM'];
  if (this.currentUser['authorized'] == "True") {
    let tkn = (message as any)['jwt'];
    this.currentUser["userEmail"] = credentials['userEmail']
    this.currentUser["userPassword"] = credentials['userPassword']
    // let jwt = new JwtHelper();
    // this.currentUser = jwt.decodeToken(tkn);
    // this.currentUser = jwt_decode(tkn);
    // console.log(this.currentUser)
    localStorage.setItem('token', tkn);
    // console.log({'authorized':true,'msg':msg, 'id':id, 'role':role})
    // return({'authorized':true,'msg':msg, 'id':id, 'role':role});
  }
  // });
  }

  // logout() { 
  //   localStorage.removeItem('token');
  //   this.currentUser = null;
  // }

  // isLoggedIn() { 
  //   return tokenNotExpired('token');
  // }
}
