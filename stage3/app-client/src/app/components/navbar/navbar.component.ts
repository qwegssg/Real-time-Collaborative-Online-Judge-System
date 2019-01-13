import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {debounce, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  title = 'CodeLeet';

  profile: any;

  searchBox: FormControl = new FormControl();
  subscription: Subscription;

  constructor(@Inject('auth') private auth,
              @Inject('input') private input,
              private router: Router) {

  }

  ngOnInit() {
    const self = this;
    if (localStorage.getItem('isLoggedIn') === 'true') {
      if (self.auth.userProfile) {
        self.profile = self.auth.userProfile;
      } else {
        console.log('renewSession was called!');
        self.auth.renewSession().then(function() {
          self.auth.getProfile((err, profile) => {
            self.profile = profile;
          });
        }).catch(function(err) {
          console.log(err);
        });
      }
    } else {
      self.auth.handleAuthentication().then(function() {
        self.auth.getProfile((err, profile) => {
          self.profile = profile;
        });
      }).catch(function(err) {
        console.log(err);
      });
    }

    // valueChanges property of searchBox is an observable.
    // .pipe(debounceTime(400)): delay 400ms, then subscribe.
    this.subscription = this.searchBox
      .valueChanges
      .pipe(debounceTime(400))
      .subscribe(term => {
          this.input.changeInput(term);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchProblem(): void {
    this.router.navigate(['/problems']);
}
}
