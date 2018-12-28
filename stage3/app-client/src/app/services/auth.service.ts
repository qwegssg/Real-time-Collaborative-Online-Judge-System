import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
// import 'rxjs/add/operator/toPromise';

import { filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthService {

  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: 'hlKNud6NY7DxrPv2s44utjvo69WcsoVc',
    domain: 'collaborativeoj-yutaoren.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:3000',
    scope: 'openid email profile'
  });

  userProfile: any;

  constructor(private router: Router, private http: Http) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }

  // Add more methods to the AuthService service to handle authentication:
  public handleAuthentication(): Promise<Object> {
    // Promise process:
    const self = this;
    return new Promise((resolve, reject) => {
      self.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          self.setSession(authResult);
          self.router.navigate(['/problems']);
          // Promise process:
          console.log(authResult);
          resolve(authResult);
        } else if (err) {
          self.router.navigate(['/problems']);
          console.log(err);
          // Promise process:
          reject(err);
        }
      });
    });
  }

  private setSession(authResult): void {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
  }

  public renewSession(): Promise<Object> {
    // Promise process:
    const self = this;
    return new Promise((resolve, reject) => {
      self.auth0.checkSession({}, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          self.setSession(authResult);
          // Promise process:
          console.log(authResult);
          resolve(authResult);
        } else if (err) {
          alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
          // Promise process:
          reject(err);
          self.logout();
        }
      });
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this._expiresAt;
  }


  public getProfile(cb): void {
    if (!this._accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(this._accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }


  public resetPassword(): void {
    const profile = this.userProfile;
    const url = `https://${this.auth0.baseOptions.domain}/dbconnections/change_password`;
    const headers = new Headers({ 'content-type': 'application/json' });
    const requestOptions = new RequestOptions({ headers: headers});
    const body = {
      client_id: this.auth0.baseOptions.clientID,
      email: profile.email,
      connection: 'Username-Password-Authentication'
    };
    // console.log(this.auth0);
    // console.log(profile);
    // console.log(url);
    // console.log(body);
    this.http.post(url, body, requestOptions)
      .toPromise()
      .then((res: Response) => {
        // res.json will throw an ERROR, use res.text instead!
        console.log(res.text());
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error);
    return Promise.reject(error.message || error);
  }
}
