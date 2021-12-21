import { Observable } from "rxjs/Observable";
import { DirtyCheckGuard } from "./dirty-check.guard"; 
  
export interface ComponentCanDeactivate {  
  canDeactivate: () => boolean | Observable<boolean>;  
}