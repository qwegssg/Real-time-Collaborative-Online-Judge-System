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
    if (this.auth.authenticated() && this.auth.getProfile().roles.includes('Admin')) {
      return true;
    } else {
      return false;
    }
  }
}
