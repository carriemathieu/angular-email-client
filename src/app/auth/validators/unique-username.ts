import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator} from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from '../auth.service';

// needs to use dependency injection in order to use http client library. only have access if we are using a class that is making use of dependency injection system
// alternative: add httpclient in constructor, BUT whenever we manually create instnace of UniqueInstance, we have to pass in HTTP client
@Injectable({ providedIn: 'root'})
export class UniqueUsername implements AsyncValidator{
    // needs depency injection to get reference to HTTP client
    constructor(private authService: AuthService){}

    validate = (control: AbstractControl) => {
        const { value } = control;

        // transforms value and returns new value

        return this.authService.usernameAvailable(value) 
            .pipe(
            map(() => {
                return null; // only hits map function if 200 status. some APIs will return 200 status even if username not avail - in that case, will need to do additional checks before returning null (i.e: map((value) => {if (value.available) {...}} )
            }),
            catchError((err) => {
                if (err.error.username) {
                     // "of" = shortcut for creating new observable (alternative to writing return new Observable)
                    return of({ nonUniqueUsername: true})
                } else {
                    return of({ noConnection: true})
                }
            })
        )
    };
}
