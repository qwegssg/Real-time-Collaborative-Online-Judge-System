import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';

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
    scope: 'openid profile'
  });

  userProfile: any;

  constructor(public router: Router) {
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
}
