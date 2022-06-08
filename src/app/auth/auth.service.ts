import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'

interface UsernameAvailableResponse {
  available: boolean;
}

interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}

interface SignupResponse {
  username: string;
}

interface SignedinResponse {
  authenticated: boolean;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  rootUrl = 'https://api.angular-email.com'

  // Requirements for signed in observable:
  // - must be able to get it to emit a new value 'from the outside' (Subject observable meets this requirement)
  // - must be able to give it a default/starting value (BehaviorSubject)
  // - new subscribers must be given value from it immediately after subscribing (BehaviorSubject gives most recent value)
  signedin$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  usernameAvailable(username: string) {
    return this.http.post<UsernameAvailableResponse>(
      `${this.rootUrl}/auth/username`, {
        username
    })
  }

  signup(credentials: SignupCredentials) {
    return this.http.post<SignupResponse>(
      `${this.rootUrl}/auth/signup`, 
        credentials
    ).pipe(
      tap(()=> {
        this.signedin$.next(true); // if there's an error, we will skip over the tap operator and essentially skip this line of codes
      }) // tap allows us to reach in, intercept value, and do something with it
    )
  }

  checkAuth() {
    return this.http.get<SignedinResponse>(`${this.rootUrl}/auth/signedin`)
    .pipe(
      tap(({ authenticated }) =>
        this.signedin$.next(authenticated)
    ))
  }

  signout() {
    this.http.post(`${this.rootUrl}/auth/signout`, {})
    .pipe(
      tap(() => {
        this.signedin$.next(false); // tells rest of application we are no longer signed in
      })
    )
  }
}
