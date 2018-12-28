import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'CodeLeet';

  profile: any;

  constructor(@Inject('auth') private auth) {

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
  }
}
