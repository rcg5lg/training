import { Component } from '@angular/core';

import { User } from '../shared/models/user';
import { UserManagerService } from '../shared/services/user-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  title= 'Please login..';

  username = '';
  password = '';
  loginError = '';
  welcomeMsg = '';

  constructor(protected userMgr: UserManagerService, protected router: Router) { }

  reset() {
    this.loginError = '';
    this.welcomeMsg = '';
  }

  doLogin() {
    this.reset();

    this.doTask()
      .then((userData: User) => {
        this.welcomeMsg = 'Hello ' + userData.name;

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 700);

      })
      .catch((err: Error) => {
        this.loginError = err.message;
      });
  }

  doTask(): Promise<any> {
    return this.userMgr.doUserLogin(this.username, this.password);
  }
}
