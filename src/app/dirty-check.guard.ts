import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from './component-can-deactivate';

@Injectable({
  providedIn: 'root'
})
export class DirtyCheckGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // throw new Error('Method not implemented.');
    if(component.canDeactivate()){
      return true
    }
    else{
      return confirm("You have unsaved changes, do you want to continue?")
    }
  }
  // canDeactivate(component: ComponentCanDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
  //   // throw new Error('Method not implemented.');
  //   return component.canDeactivate();
  // }
}
