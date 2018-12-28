import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'CodeLeet';

  // username = '';

  profile: any;

  constructor(@Inject('auth') private auth) {

  }

  ngOnInit() {
    const self = this;
    if (localStorage.getItem('isLoggedIn') === 'true') {
      console.log('renewSession was called!');
      self.auth.renewSession().then(function() {
        if (self.auth.userProfile) {
          self.profile = self.auth.userProfile;
        } else {
          self.auth.getProfile((err, profile) => {
            self.profile = profile;
          });
        }
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      self.auth.handleAuthentication().then(function() {
        if (self.auth.userProfile) {
          self.profile = self.auth.userProfile;
        } else {
          self.auth.getProfile((err, profile) => {
            self.profile = profile;
          });
        }
      }).catch(function(err) {
        console.log(err);
      });
    }
  }
}
