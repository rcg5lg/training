import { Component, OnInit } from '@angular/core';

// components
import { LoginComponent } from '../login/login.component';

// models
import { User } from '../shared/models/user';

@Component({
  selector: 'app-register',
  templateUrl: '../register/register.component.html',
  styleUrls: ['../register/register.component.css']
})
export class RegisterComponent extends LoginComponent {

  title = 'Please insert details..';

  doTask(): Promise<any> {
    const userData: User = new User();
    userData.username = this.username;
    userData.name = this.username;

    return this.userMgr.registerUser(userData, this.password);
  }
}
