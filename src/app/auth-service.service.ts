import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { JwtHelper } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  currentUser: any;
  constructor(private httpClient: HttpClient) {
    let token = localStorage.getItem('token');
    // if (token) {
    //   let jwt = new JwtHelper();
    //   this.currentUser = jwt.decodeToken(token);
    // }
  }

  login(credentials:any) {
    return this.httpClient.get('http://127.0.0.1:5002/login/' + credentials['userEmail'] + '/' + credentials['userPassword']).toPromise().then(message => {
      let auth = (message as any)['authorized'];
      let msg = (message as any)['message'];
      let id = (message as any)['id'];
      let role = (message as any)['role'];
      if (auth == "True") {
        let tkn = (message as any)['jwt'];
        // let jwt = new JwtHelper();
        // this.currentUser = jwt.decodeToken(tkn);
        localStorage.setItem('token', tkn);
        return({'authorized':true,'msg':msg, 'id':id, 'role':role});
      }
      else return({'authorized':false,'msg':msg});
    });
  }

  // logout() { 
  //   localStorage.removeItem('token');
  //   this.currentUser = null;
  // }

  // isLoggedIn() { 
  //   return tokenNotExpired('token');
  // }
}
