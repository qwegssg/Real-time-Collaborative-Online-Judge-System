import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(@Inject('auth') private auth, private router: Router) { }

  canActivate() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      // console.log('can activate!');
      return true;
    } else {
      // redirect to home page if not logged in
      this.router.navigate(['/problems']);
      // console.log('can not activate!');
      return false;
    }
  }

  isAdmin(): boolean {
    // already added a rule for extracting roles data from token
    // check the Auth0 dashboard
    if (localStorage.getItem('isLoggedIn') === 'true'
        && this.auth.userProfile != null
        && this.auth.userProfile['https://randomurl.com/roles'].includes('Admin')) {
      return true;
    } else {
      return false;
    }
  }
}
