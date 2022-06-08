import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEventType
} from '@angular/common/http';
import { Observable } from "rxjs";
import { tap, filter } from "rxjs/operators";

// http client discards cookie -> withCredentials ensures cookie is not discarded when request returned from API
// using instead of writing 'withcredentials:true' a whole bunch times
@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
    // req - request object sent to remote server, includes URL & any arguments
    // next - so we can have multiple interceptors
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedReq = req.clone({
            withCredentials: true
        }) //withCredentials marked as readonly & default to false. cloning allows us to modify withCredentials to true
        return next.handle(modifiedReq)
        .pipe(
            // only proceed through pipe if http request type is sent
            filter (val => val.type === HttpEventType.Sent),
            // types: sent=sent to server, response=received response
            tap(val => {
                console.log('send!')
            })
        ) 
    }
}
