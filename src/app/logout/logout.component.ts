import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { UserManagerService } from '../shared/services/user-manager.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  started = false;
  confirmed = false;
  errorMsg: String;

  constructor(private userMgr: UserManagerService, private router: Router) { }

  reset(): void {
    this.confirmed = false;
    this.started = false;
    this.errorMsg = '';
  }

  ngOnInit(): void {
    this.reset();

    if (confirm('Please confirm your logout')) {
      this.started = true;
      setTimeout(() => {
        this.userMgr.doUserLogout()
          .then(() => {
            this.started = false;
            this.confirmed = true;

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 700);
          })
          .catch((err) => {
            this.started = false;
            this.confirmed = false;

            this.errorMsg = err.message;
          });
      }, 700);
    }
  }

}
