import {Component, Inject, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any;

  constructor(@Inject('auth') private auth) { }

  ngOnInit() {
    const self = this;
    if (self.auth.userProfile) {
      self.profile = this.auth.userProfile;
      console.log(self.profile);
    } else {
      console.log('renewSession was called!');
      self.auth.renewSession().then(function() {
        self.auth.getProfile((err, profile) => {
          self.profile = profile;
          console.log(self.profile);
        });
      }).catch(function(err) {
        console.log(err);
      });
    }
  }
}
